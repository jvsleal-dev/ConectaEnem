import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getAuthenticatedUser } from '#server/services/auth.service'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
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
      studentId: user.id
    },
    include: {
      classroom: {
        select: {
          id: true,
          name: true,
          teacher: {
            select: {
              name: true
            }
          }
        }
      },
      correction: {
        include: {
          teacher: {
            select: {
              name: true,
              image: true
            }
          }
        }
      },
      annotations: {
        orderBy: {
          createdAt: 'asc'
        }
      }
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
