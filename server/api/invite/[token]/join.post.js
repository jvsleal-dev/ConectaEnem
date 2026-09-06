import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getAuthenticatedUser } from '#server/services/auth.service'
import { joinClassroomByInvite } from '#server/services/classroom.service'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Código ou link de convite inválido.'
    })
  }

  const result = await joinClassroomByInvite(token, user.id)

  return result
})
