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

  const existing = await prisma.essayArgument.findUnique({ where: { id } })
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Argumento não encontrado.'
    })
  }

  const updated = await prisma.essayArgument.update({
    where: { id },
    data: {
      title: body.title !== undefined ? body.title.trim() : existing.title,
      axis: body.axis !== undefined ? (body.axis ? body.axis.trim() : null) : existing.axis,
      content: body.content !== undefined ? body.content.trim() : existing.content,
      application: body.application !== undefined ? (body.application ? body.application.trim() : null) : existing.application,
      active: body.active !== undefined ? Boolean(body.active) : existing.active
    }
  })

  return {
    success: true,
    argument: updated
  }
})
