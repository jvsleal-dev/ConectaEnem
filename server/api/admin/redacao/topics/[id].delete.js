import { defineEventHandler, createError } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido.'
    })
  }

  await prisma.essayTopic.delete({ where: { id } })

  return {
    success: true,
    message: 'Tema removido com sucesso.'
  }
})
