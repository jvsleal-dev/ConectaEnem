import { defineEventHandler, readBody, createError } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.title || !body.title.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O título do argumento é obrigatório.'
    })
  }

  if (!body.content || !body.content.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O conteúdo do argumento é obrigatório.'
    })
  }

  const argumentItem = await prisma.essayArgument.create({
    data: {
      title: body.title.trim(),
      axis: body.axis?.trim() || null,
      content: body.content.trim(),
      application: body.application?.trim() || null,
      active: body.active !== undefined ? Boolean(body.active) : true
    }
  })

  return {
    success: true,
    argument: argumentItem
  }
})
