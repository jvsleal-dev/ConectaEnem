import { createError } from 'h3'

import prisma from '#server/utils/prisma'
import { createSupabaseServerClient } from '#server/utils/supabase'


function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    active: user.active
  }
}


/**
 * Cadastro de aluno ou professor.
 *
 * A role NÃO vem livremente do frontend.
 * As rotas student.post.js e teacher.post.js
 * determinam qual role será utilizada.
 */
export async function registerUser({
  event,
  name,
  email,
  password,
  role
}) {
  const normalizedEmail = email
    .trim()
    .toLowerCase()

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  })


  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Já existe uma conta com este email.'
    })
  }


  const supabase =
    createSupabaseServerClient(event)


  const {
    data,
    error
  } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,

    options: {
      data: {
        name: name.trim()
      }
    }
  })


  if (error) {
    console.error(
      'ERRO NO CADASTRO DO SUPABASE:',
      {
        message: error.message,
        code: error.code,
        status: error.status
      }
    )


    if (
      error.code ===
      'user_already_exists'
    ) {
      throw createError({
        statusCode: 409,
        statusMessage:
          'Já existe uma conta com este email.'
      })
    }


    throw createError({
      statusCode: 400,
      statusMessage:
        error.message ||
        'Não foi possível criar sua conta.'
    })
  }


  if (!data.user) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Não foi possível criar o usuário.'
    })
  }


  try {
    const user =
      await prisma.$transaction(
        async (tx) => {
          const createdUser =
            await tx.user.create({
              data: {
                authId: data.user.id,
                name: name.trim(),
                email: normalizedEmail,
                role,
                active: true
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
        }
      )


    return {
      success: true,

      user: formatUser(user),

      requiresEmailConfirmation:
        !data.session
    }
  }
  catch (error) {
    console.error(
      'ERRO AO CRIAR PERFIL NO BANCO:',
      error
    )


    throw createError({
      statusCode: 500,
      statusMessage:
        'A conta foi criada, mas ocorreu um erro ao criar o perfil.'
    })
  }
}


/**
 * Login.
 *
 * O Supabase verifica email e senha.
 * Depois buscamos o usuário no nosso banco
 * para verificar:
 *
 * - se possui perfil
 * - se está ativo
 * - qual é sua role verdadeira
 */
export async function loginUser({
  event,
  email,
  password,
  role
}) {
  const normalizedEmail = email
    .trim()
    .toLowerCase()


  const supabase =
    createSupabaseServerClient(event)


  const {
    data,
    error
  } =
    await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    })


  /*
   * IMPORTANTE:
   *
   * Este console mostra no terminal
   * o erro REAL retornado pelo Supabase.
   */
  if (error) {
    console.error(
      'ERRO REAL DO SUPABASE:',
      {
        message: error.message,
        code: error.code,
        status: error.status
      }
    )


    if (
      error.code ===
      'email_not_confirmed'
    ) {
      throw createError({
        statusCode: 401,
        statusMessage:
          'Email ainda não confirmado.'
      })
    }


    if (
      error.code ===
      'invalid_credentials'
    ) {
      throw createError({
        statusCode: 401,
        statusMessage:
          'Email ou senha incorretos.'
      })
    }


    throw createError({
      statusCode: 401,
      statusMessage:
        error.message ||
        'Não foi possível realizar o login.'
    })
  }


  if (!data.user) {
    throw createError({
      statusCode: 401,
      statusMessage:
        'Não foi possível autenticar o usuário.'
    })
  }


  const user =
    await prisma.user.findUnique({
      where: {
        authId: data.user.id
      }
    })


  /*
   * Supabase autenticou,
   * mas não existe perfil no nosso banco.
   */
  if (!user) {
    await supabase.auth.signOut()


    throw createError({
      statusCode: 401,
      statusMessage:
        'Perfil do usuário não encontrado.'
    })
  }


  /*
   * Conta bloqueada/desativada.
   */
  if (!user.active) {
    await supabase.auth.signOut()


    throw createError({
      statusCode: 403,
      statusMessage:
        'Esta conta está desativada.'
    })
  }


  /*
   * A role verdadeira vem do PostgreSQL.
   *
   * O seletor ALUNO/PROFESSOR da tela
   * não concede nenhuma permissão.
   */
  if (user.role !== role) {
    await supabase.auth.signOut()


    throw createError({
      statusCode: 403,

      statusMessage:
        role === 'TEACHER'
          ? 'Esta conta não possui acesso como professor.'
          : 'Esta conta não possui acesso como aluno.'
    })
  }


  return {
    success: true,
    user: formatUser(user)
  }
}


/**
 * Retorna o usuário autenticado.
 *
 * getUser() consulta/valida o usuário
 * utilizando o Supabase Auth.
 */
export async function getAuthenticatedUser(
  event
) {
  const supabase =
    createSupabaseServerClient(event)


  const {
    data,
    error
  } = await supabase.auth.getUser()


  if (
    error ||
    !data.user
  ) {
    throw createError({
      statusCode: 401,
      statusMessage:
        'Usuário não autenticado.'
    })
  }


  const user =
    await prisma.user.findUnique({
      where: {
        authId: data.user.id
      }
    })


  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage:
        'Perfil do usuário não encontrado.'
    })
  }


  if (!user.active) {
    throw createError({
      statusCode: 403,
      statusMessage:
        'Esta conta está desativada.'
    })
  }


  return formatUser(user)
}


/**
 * Logout.
 */
export async function logoutUser(event) {
  const supabase =
    createSupabaseServerClient(event)


  const {
    error
  } = await supabase.auth.signOut()


  if (error) {
    console.error(
      'ERRO AO FAZER LOGOUT:',
      {
        message: error.message,
        code: error.code,
        status: error.status
      }
    )


    throw createError({
      statusCode: 400,
      statusMessage:
        'Não foi possível sair da conta.'
    })
  }


  return {
    success: true
  }
}