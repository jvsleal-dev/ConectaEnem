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

  const c1Score = Math.max(0, Math.min(200, parseInt(body.c1Score ?? 0, 10)))
  const c2Score = Math.max(0, Math.min(200, parseInt(body.c2Score ?? 0, 10)))
  const c3Score = Math.max(0, Math.min(200, parseInt(body.c3Score ?? 0, 10)))
  const c4Score = Math.max(0, Math.min(200, parseInt(body.c4Score ?? 0, 10)))
  const c5Score = Math.max(0, Math.min(200, parseInt(body.c5Score ?? 0, 10)))
  const totalScore = c1Score + c2Score + c3Score + c4Score + c5Score

  const correctionData = {
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
    justification1: body.justification1 || body.c1Comment || null,
    justification2: body.justification2 || body.c2Comment || null,
    justification3: body.justification3 || body.c3Comment || null,
    justification4: body.justification4 || body.c4Comment || null,
    justification5: body.justification5 || body.c5Comment || null,
    positivePoints: body.positivePoints || null,
    improvements: body.improvements || null,
    generalComment: body.generalComment || body.generalFeedback || null,
    generalFeedback: body.generalFeedback || body.generalComment || null
  }

  // 1. Atualizar ou criar EssayCorrection
  const correction = await prisma.essayCorrection.upsert({
    where: { essayId: essay.id },
    create: {
      essayId: essay.id,
      teacherId: teacher.id,
      ...correctionData
    },
    update: {
      ...correctionData
    }
  })

  // 2. Se vierem anotações no payload, sincronizar
  if (Array.isArray(body.annotations)) {
    await prisma.$transaction(async (tx) => {
      await tx.essayAnnotation.deleteMany({
        where: { essayId: id }
      })

      if (body.annotations.length > 0) {
        await tx.essayAnnotation.createMany({
          data: body.annotations.map((ann) => ({
            id: ann.id || undefined,
            essayId: id,
            type: ann.type || 'DRAW',
            category: ann.category || null,
            color: ann.color || '#ef4444',
            strokeWidth: ann.strokeWidth !== undefined ? Number(ann.strokeWidth) : 3.0,
            content: ann.content || null,
            selectedText: ann.selectedText || null,
            startOffset: ann.startOffset !== undefined && ann.startOffset !== null ? Number(ann.startOffset) : null,
            endOffset: ann.endOffset !== undefined && ann.endOffset !== null ? Number(ann.endOffset) : null,
            x: ann.x !== undefined && ann.x !== null ? Number(ann.x) : null,
            y: ann.y !== undefined && ann.y !== null ? Number(ann.y) : null,
            width: ann.width !== undefined && ann.width !== null ? Number(ann.width) : null,
            height: ann.height !== undefined && ann.height !== null ? Number(ann.height) : null,
            points: ann.points ? (typeof ann.points === 'string' ? ann.points : JSON.stringify(ann.points)) : null
          }))
        })
      }
    })
  }

  // 3. Marcar a redação como corrigida (GRADED)
  await prisma.essay.update({
    where: { id: essay.id },
    data: { status: 'GRADED' }
  })

  return {
    success: true,
    correction
  }
})
