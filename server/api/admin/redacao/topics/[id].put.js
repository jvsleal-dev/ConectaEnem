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

  const existing = await prisma.essayTopic.findUnique({ where: { id } })
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tema de redação não encontrado.'
    })
  }

  const updated = await prisma.essayTopic.update({
    where: { id },
    data: {
      title: body.title !== undefined ? body.title.trim() : existing.title,
      axis: body.axis !== undefined ? (body.axis ? body.axis.trim() : null) : existing.axis,
      description: body.description !== undefined ? (body.description ? body.description.trim() : null) : existing.description,
      motivationText: body.motivationText !== undefined ? (body.motivationText || null) : existing.motivationText,
      imageUrl: body.imageUrl !== undefined ? (body.imageUrl || null) : existing.imageUrl,
      active: body.active !== undefined ? Boolean(body.active) : existing.active
    }
  })

  return {
    success: true,
    topic: updated
  }
})
