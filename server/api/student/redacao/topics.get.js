import { defineEventHandler } from 'h3'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async () => {
  const topics = await prisma.essayTopic.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    topics
  }
})
