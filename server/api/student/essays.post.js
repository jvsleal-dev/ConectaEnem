import { defineEventHandler, readBody, createError } from 'h3'
import { getAuthenticatedUser } from '#server/services/auth.service'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)

  if (!body.theme || !body.theme.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O tema da redação é obrigatório.'
    })
  }

  const submissionType = body.submissionType === 'IMAGE' ? 'IMAGE' : 'TEXT'

  if (submissionType === 'TEXT' && (!body.content || !body.content.trim())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O texto da redação é obrigatório.'
    })
  }

  if (submissionType === 'IMAGE' && !body.imageUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A foto da folha de redação é obrigatória.'
    })
  }

  const essay = await prisma.essay.create({
    data: {
      studentId: user.id,
      classroomId: body.classroomId || null,
      theme: body.theme.trim(),
      title: body.title?.trim() || null,
      content: submissionType === 'TEXT' ? body.content.trim() : null,
      imageUrl: submissionType === 'IMAGE' ? body.imageUrl : null,
      submissionType,
      status: 'PENDING'
    }
  })

  return {
    success: true,
    essay
  }
})
