import {
  createError,
  getRouterParam
} from 'h3'

import { requireAdmin } from '#server/utils/require-admin.js'
import { getSubjectById } from '#server/services/subject.service'

export default defineEventHandler(
  async (event) => {
    await requireAdmin(event)

    const id =
      getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID inválido.'
      })
    }

    const subject =
      await getSubjectById(id)

    return {
      subject
    }
  }
)