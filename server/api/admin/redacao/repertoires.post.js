import { defineEventHandler, readBody, createError } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.title || !body.title.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O título do repertório é obrigatório.'
    })
  }

  if (!body.content || !body.content.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A explicação do repertório é obrigatória.'
    })
  }

  const repertoireItem = await prisma.essayRepertoire.create({
    data: {
      title: body.title.trim(),
      author: body.author?.trim() || null,
      axis: body.axis?.trim() || null,
      content: body.content.trim(),
      quote: body.quote?.trim() || null,
      active: body.active !== undefined ? Boolean(body.active) : true
    }
  })

  return {
    success: true,
    repertoire: repertoireItem
  }
})
