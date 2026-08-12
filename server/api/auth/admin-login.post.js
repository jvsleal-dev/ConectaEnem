import { createError, readBody } from 'h3'
import { z } from 'zod'

import { loginUser } from '#server/services/auth.service'

const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Informe um email válido.'),

  password: z
    .string()
    .min(1, 'Informe sua senha.')
    .max(128, 'Senha inválida.')
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const validation = adminLoginSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Dados inválidos.'
    })
  }

  return loginUser({
    event,
    email: validation.data.email,
    password: validation.data.password,

    // A role é definida no backend.
    // O frontend não pode escolher ADMIN.
    role: 'ADMIN'
  })
})