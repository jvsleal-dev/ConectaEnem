import { defineEventHandler } from 'h3'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async () => {
  const argumentsList = await prisma.essayArgument.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    arguments: argumentsList
  }
})
