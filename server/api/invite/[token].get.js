import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getInviteInfo } from '#server/services/classroom.service'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Código ou link de convite inválido.'
    })
  }

  const info = await getInviteInfo(token)

  return {
    success: true,
    invite: info
  }
})
