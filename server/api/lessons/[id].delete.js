import {
  createError,
  getRouterParam
} from 'h3'

import {
  requireAdmin
} from '#server/utils/require-admin.js'

import {
  deleteLesson
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

    await deleteLesson(id)

    return {
      success: true
    }
  }
)