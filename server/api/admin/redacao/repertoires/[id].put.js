import { defineEventHandler, readBody, createError } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido.'
    })
  }

  const existing = await prisma.essayRepertoire.findUnique({ where: { id } })
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Repertório não encontrado.'
    })
  }

  const updated = await prisma.essayRepertoire.update({
    where: { id },
    data: {
      title: body.title !== undefined ? body.title.trim() : existing.title,
      author: body.author !== undefined ? (body.author ? body.author.trim() : null) : existing.author,
      axis: body.axis !== undefined ? (body.axis ? body.axis.trim() : null) : existing.axis,
      content: body.content !== undefined ? body.content.trim() : existing.content,
      quote: body.quote !== undefined ? (body.quote ? body.quote.trim() : null) : existing.quote,
      active: body.active !== undefined ? Boolean(body.active) : existing.active
    }
  })

  return {
    success: true,
    repertoire: updated
  }
})
