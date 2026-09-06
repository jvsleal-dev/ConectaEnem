import { defineEventHandler } from 'h3'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async () => {
  const subjects = await prisma.subject.findMany({
    where: {
      active: true
    },
    orderBy: [
      { order: 'asc' },
      { name: 'asc' }
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true
    }
  })

  return {
    success: true,
    subjects,
    data: subjects
  }
})
