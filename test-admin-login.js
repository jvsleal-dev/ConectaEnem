import 'dotenv/config'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { PrismaClient } from './generated/prisma/client.js'
import { PrismaMysql } from '@prisma/adapter-mysql'

function verifyPassword(password, storedPassword) {
  if (!storedPassword || !storedPassword.includes(':')) return false
  const [salt, originalHash] = storedPassword.split(':')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'))
}

async function main() {
  const adapter = new PrismaMysql(process.env.DATABASE_URL)
  const prisma = new PrismaClient({ adapter })

  const email = 'oficialconectaenem@gmail.com'
  const password = 'Admin@Conecta2026'

  console.log(`Testando login com: ${email}`)

  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true }
  })

  if (!user) {
    console.error('✖ Usuário não encontrado!')
    process.exit(1)
  }

  console.log(`  Nome:   ${user.name}`)
  console.log(`  Role:   ${user.role}`)
  console.log(`  Ativo:  ${user.active}`)

  const credentialAccount = user.accounts.find(a => a.providerId === 'credential')

  if (!credentialAccount) {
    console.error('✖ Conta credential não encontrada!')
    process.exit(1)
  }

  const passwordOk = verifyPassword(password, credentialAccount.password)

  if (passwordOk) {
    console.log('  Senha:  ✔ válida')
    console.log('\n✔ LOGIN DO ADMINISTRADOR FUNCIONA CORRETAMENTE!')
  } else {
    console.error('  Senha:  ✖ inválida')
    process.exit(1)
  }

  if (user.role !== 'ADMIN') {
    console.error('✖ Role não é ADMIN!')
    process.exit(1)
  }

  if (!user.active) {
    console.error('✖ Usuário não está ativo!')
    process.exit(1)
  }

  await prisma.$disconnect()
}

main()
