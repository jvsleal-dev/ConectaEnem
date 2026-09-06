import { defineEventHandler, getRouterParam, createError } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const teacher = await requireTeacher(event)
  const id = getRouterParam(event, 'id')

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
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      classroom: {
        select: {
          id: true,
          name: true,
          code: true
        }
      },
      correction: true
    }
  })

  if (!essay) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Redação não encontrada.'
    })
  }

  return {
    success: true,
    essay
  }
})
