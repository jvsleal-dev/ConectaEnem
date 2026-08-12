import {
  createError,
  getRouterParam,
  readBody
} from 'h3'

import {
  lessonSchema
} from '#shared/validators/lesson.js'

import {
  requireAdmin
} from '#server/utils/require-admin.js'

import {
  updateLesson
} from '#server/services/lesson.service.js'

export default defineEventHandler(
  async (event) => {
    await requireAdmin(event)

    const id =
      getRouterParam(
        event,
        'id'
      )

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'ID da aula inválido.'
      })
    }

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
      await updateLesson(
        id,
        validation.data
      )

    return {
      success: true,
      lesson
    }
  }
)