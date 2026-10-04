import { defineEventHandler } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const repertoires = await prisma.essayRepertoire.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    repertoires
  }
})
