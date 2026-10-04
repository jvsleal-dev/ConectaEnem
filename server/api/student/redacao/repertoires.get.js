import { defineEventHandler } from 'h3'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async () => {
  const repertoires = await prisma.essayRepertoire.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    repertoires
  }
})
