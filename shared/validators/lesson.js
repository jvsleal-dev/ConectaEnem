import { z } from 'zod'

export const lessonSchema = z.object({
  moduleId: z
    .string()
    .uuid('Módulo inválido.'),

  title: z
    .string()
    .trim()
    .min(2, 'Informe o título da aula.')
    .max(150, 'O título deve possuir no máximo 150 caracteres.'),

  description: z
    .string()
    .trim()
    .max(1000, 'A descrição deve possuir no máximo 1000 caracteres.')
    .optional()
    .nullable(),

  videoUrl: z
    .string()
    .trim()
    .url('Informe uma URL de vídeo válida.')
    .optional()
    .nullable()
    .or(z.literal('')),

  order: z
    .coerce
    .number()
    .int()
    .min(1, 'A ordem deve ser igual ou maior que 1.')
    .optional(),

  active: z
    .boolean()
    .default(true)
})