import { defineEventHandler, readBody, createError } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.title || !body.title.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O título do tema é obrigatório.'
    })
  }

  try {
    const topic = await prisma.essayTopic.create({
      data: {
        title: body.title.trim(),
        axis: body.axis?.trim() || null,
        description: body.description?.trim() || null,
        motivationText: body.motivationText || null,
        imageUrl: body.imageUrl || null,
        active: body.active !== undefined ? Boolean(body.active) : true
      }
    })

    return {
      success: true,
      topic
    }
  } catch (err) {
    console.error('[TOPIC POST ERROR]', err)
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || 'Erro interno ao cadastrar tema.'
    })
  }
})
