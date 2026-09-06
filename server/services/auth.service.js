import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { createError, getCookie, getHeader, setCookie, deleteCookie } from 'h3'
import prisma from '#server/utils/prisma'

const SESSION_COOKIE_NAME = 'better-auth.session_token'
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedPassword) {
  if (!storedPassword || !storedPassword.includes(':')) {
    return false
  }
  const [salt, originalHash] = storedPassword.split(':')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'))
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
    active: user.active
  }
}

async function createSession(event, userId) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt
    }
  })

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt
  })

  return token
}

export async function registerUser({
  event,
  name,
  email,
  password,
  role
}) {
  const normalizedEmail = email.trim().toLowerCase()

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'J? existe uma conta com este email.'
    })
  }

  const hashedPassword = hashPassword(password)

  try {
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          role,
          active: true
        }
      })

      await tx.account.create({
        data: {
          userId: createdUser.id,
          providerId: 'credential',
          accountId: normalizedEmail,
          password: hashedPassword
        }
      })

      if (role === 'TEACHER') {
        await tx.teacherProfile.create({
          data: {
            userId: createdUser.id
          }
        })
      }

      return createdUser
    })

    if (event) {
      await createSession(event, user.id)
    }

    return {
      success: true,
      user: formatUser(user)
    }
  } catch (error) {
    console.error('ERRO AO CRIAR CONTA NO BANCO:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ocorreu um erro ao criar sua conta.'
    })
  }
}

export async function loginUser({
  event,
  email,
  password,
  role
}) {
  const normalizedEmail = email.trim().toLowerCase()

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    },
    include: {
      accounts: true
    }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email ou senha incorretos.'
    })
  }

  const credentialAccount = user.accounts.find(
    (acc) => acc.providerId === 'credential'
  )

  if (!credentialAccount || !verifyPassword(password, credentialAccount.password)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email ou senha incorretos.'
    })
  }

  if (!user.active) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Esta conta est? desativada.'
    })
  }

  if (user.role !== role) {
    throw createError({
      statusCode: 403,
      statusMessage:
        role === 'TEACHER'
          ? 'Esta conta n?o possui acesso como professor.'
          : role === 'ADMIN'
            ? 'Acesso administrativo necess?rio.'
            : 'Esta conta n?o possui acesso como aluno.'
    })
  }

  if (event) {
    await createSession(event, user.id)
  }

  return {
    success: true,
    user: formatUser(user)
  }
}

export async function getAuthenticatedUser(event) {
  const token =
    getCookie(event, SESSION_COOKIE_NAME) ||
    getCookie(event, 'auth_session') ||
    getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Usu?rio n?o autenticado.'
    })
  }

  const session = await prisma.session.findUnique({
    where: {
      token
    },
    include: {
      user: true
    }
  })

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Usu?rio n?o autenticado.'
    })
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } }).catch(() => {})
    deleteCookie(event, SESSION_COOKIE_NAME)
    deleteCookie(event, 'auth_session')
    throw createError({
      statusCode: 401,
      statusMessage: 'Sess?o expirada.'
    })
  }

  if (!session.user.active) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Esta conta est? desativada.'
    })
  }

  return formatUser(session.user)
}

export async function logoutUser(event) {
  const token =
    getCookie(event, SESSION_COOKIE_NAME) ||
    getCookie(event, 'auth_session')

  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => {})
    deleteCookie(event, SESSION_COOKIE_NAME)
    deleteCookie(event, 'auth_session')
  }

  return {
    success: true
  }
}
