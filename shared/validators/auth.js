import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo.')
    .max(120, 'O nome deve possuir no máximo 120 caracteres.'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Informe um email válido.')
    .max(254, 'Email muito longo.'),

  password: z
    .string()
    .min(8, 'A senha deve possuir pelo menos 8 caracteres.')
    .max(128, 'A senha deve possuir no máximo 128 caracteres.')
})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Informe um email válido.')
    .max(254, 'Email muito longo.'),

  password: z
    .string()
    .min(1, 'Informe sua senha.')
    .max(128, 'Senha inválida.'),

  role: z.enum([
    'STUDENT',
    'TEACHER'
  ])
})