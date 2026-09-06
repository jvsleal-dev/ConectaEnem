import { createError } from 'h3'
import { getAuthenticatedUser } from '#server/services/auth.service'

export async function requireTeacher(event) {
  const user = await getAuthenticatedUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Usuário não autenticado.'
    })
  }

  if (!user.active) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Esta conta está desativada.'
    })
  }

  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso restrito para professores.'
    })
  }

  return user
}
