import { z } from 'zod'

export const moduleSchema = z.object({
  subjectId: z
    .string()
    .uuid('Matéria inválida.'),

  name: z
    .string()
    .trim()
    .min(2, 'Informe o nome do módulo.')
    .max(120, 'O nome deve possuir no máximo 120 caracteres.'),

  description: z
    .string()
    .trim()
    .max(500, 'A descrição deve possuir no máximo 500 caracteres.')
    .optional()
    .nullable(),

  order: z
    .coerce
    .number()
    .int()
    .min(0, 'A ordem não pode ser negativa.')
    .default(0),

  active: z
    .boolean()
    .default(true)
})