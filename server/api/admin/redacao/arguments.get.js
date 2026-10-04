import { defineEventHandler } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const argsList = await prisma.essayArgument.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    arguments: argsList
  }
})
