import { defineEventHandler } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const topics = await prisma.essayTopic.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    topics
  }
})
