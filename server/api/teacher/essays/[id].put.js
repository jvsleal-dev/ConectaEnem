import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const teacher = await requireTeacher(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido.'
    })
  }

  const essay = await prisma.essay.findFirst({
    where: {
      id,
      classroom: {
        teacherId: teacher.id
      }
    }
  })

  if (!essay) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Redação não encontrada.'
    })
  }

  const c1Score = Math.max(0, Math.min(200, parseInt(body.c1Score || 0, 10)))
  const c2Score = Math.max(0, Math.min(200, parseInt(body.c2Score || 0, 10)))
  const c3Score = Math.max(0, Math.min(200, parseInt(body.c3Score || 0, 10)))
  const c4Score = Math.max(0, Math.min(200, parseInt(body.c4Score || 0, 10)))
  const c5Score = Math.max(0, Math.min(200, parseInt(body.c5Score || 0, 10)))
  const totalScore = c1Score + c2Score + c3Score + c4Score + c5Score

  // Upsert na correção
  const correction = await prisma.essayCorrection.upsert({
    where: { essayId: essay.id },
    create: {
      essayId: essay.id,
      teacherId: teacher.id,
      c1Score,
      c2Score,
      c3Score,
      c4Score,
      c5Score,
      totalScore,
      c1Comment: body.c1Comment || null,
      c2Comment: body.c2Comment || null,
      c3Comment: body.c3Comment || null,
      c4Comment: body.c4Comment || null,
      c5Comment: body.c5Comment || null,
      generalFeedback: body.generalFeedback || null
    },
    update: {
      c1Score,
      c2Score,
      c3Score,
      c4Score,
      c5Score,
      totalScore,
      c1Comment: body.c1Comment || null,
      c2Comment: body.c2Comment || null,
      c3Comment: body.c3Comment || null,
      c4Comment: body.c4Comment || null,
      c5Comment: body.c5Comment || null,
      generalFeedback: body.generalFeedback || null
    }
  })

  // Atualizar status da redação para GRADED
  await prisma.essay.update({
    where: { id: essay.id },
    data: { status: 'GRADED' }
  })

  return {
    success: true,
    correction
  }
})
