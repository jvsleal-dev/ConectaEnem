import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL não encontrada.')
  }

  const adapter = new PrismaMariaDb(connectionString)

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