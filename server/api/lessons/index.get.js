import { getQuery } from 'h3'

import {
  requireAdmin
} from '#server/utils/require-admin.js'

import {
  listLessons
} from '#server/services/lesson.service.js'

export default defineEventHandler(
  async (event) => {
    await requireAdmin(event)

    const query = getQuery(event)

    const moduleId =
      typeof query.moduleId === 'string'
        ? query.moduleId
        : undefined

    const lessons =
      await listLessons({
        moduleId
      })

    return {
      lessons
    }
  }
)