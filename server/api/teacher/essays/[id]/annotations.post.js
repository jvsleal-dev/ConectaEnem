import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const teacher = await requireTeacher(event)
  const essayId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!essayId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID da redação inválido.'
    })
  }

  const essay = await prisma.essay.findFirst({
    where: {
      id: essayId,
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

  const annotations = Array.isArray(body?.annotations) ? body.annotations : []

  // Executar sincronização dentro de uma transação
  await prisma.$transaction(async (tx) => {
    // 1. Apagar todas as anotações anteriores desta redação
    await tx.essayAnnotation.deleteMany({
      where: { essayId }
    })

    // 2. Inserir as novas anotações se houver
    if (annotations.length > 0) {
      await tx.essayAnnotation.createMany({
        data: annotations.map((ann) => ({
          id: ann.id || undefined,
          essayId,
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

    // Se a redação estiver PENDING, mudar para CORRECTING quando o professor começar a interagir
    if (essay.status === 'PENDING') {
      await tx.essay.update({
        where: { id: essayId },
        data: { status: 'CORRECTING' }
      })
    }
  })

  const updatedAnnotations = await prisma.essayAnnotation.findMany({
    where: { essayId },
    orderBy: { createdAt: 'asc' }
  })

  return {
    success: true,
    annotations: updatedAnnotations
  }
})
