import {
  createError,
  getRouterParam
} from 'h3'

import {
  requireAdmin
} from '#server/utils/require-admin.js'

import {
  getLessonById
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

    const lesson =
      await getLessonById(id)

    return {
      lesson
    }
  }
)