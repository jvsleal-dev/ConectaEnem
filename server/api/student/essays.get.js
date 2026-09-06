import { defineEventHandler } from 'h3'
import { getAuthenticatedUser } from '#server/services/auth.service'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const essays = await prisma.essay.findMany({
    where: {
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
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    success: true,
    essays
  }
})
