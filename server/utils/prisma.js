import { PrismaClient } from '../../generated/prisma/client'
import { PrismaMysql } from '@prisma/adapter-mysql'

const globalForPrisma = globalThis

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL não encontrada.')
  }

  const adapter = new PrismaMysql(connectionString)

  return new PrismaClient({
    adapter
  })
}

const prisma =
  globalForPrisma.__conectarEnemPrisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__conectarEnemPrisma = prisma
}

export default prisma