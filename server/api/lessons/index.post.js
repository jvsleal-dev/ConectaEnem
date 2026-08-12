import {
  createError,
  readBody
} from 'h3'

import {
  lessonSchema
} from '#shared/validators/lesson.js'

import {
  requireAdmin
} from '#server/utils/require-admin.js'

import {
  createLesson
} from '#server/services/lesson.service.js'

export default defineEventHandler(
  async (event) => {
    await requireAdmin(event)

    const body =
      await readBody(event)

    const validation =
      lessonSchema.safeParse(body)

    if (!validation.success) {
      throw createError({
        statusCode: 422,

        statusMessage:
          'Dados inválidos.',

        data: {
          errors:
            validation.error
              .flatten()
              .fieldErrors
        }
      })
    }

    const lesson =
      await createLesson(
        validation.data
      )

    return {
      success: true,
      lesson
    }
  }
)