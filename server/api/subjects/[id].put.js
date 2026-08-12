import {
  createError,
  getRouterParam,
  readBody
} from 'h3'

import { subjectSchema } from '#shared/validators/subject'
import { requireAdmin } from '#server/utils/require-admin.js'
import { updateSubject } from '#server/services/subject.service'

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

    const body =
      await readBody(event)

    const validation =
      subjectSchema.safeParse(body)

    if (!validation.success) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Dados inválidos.',
        data: {
          errors:
            validation.error
              .flatten()
              .fieldErrors
        }
      })
    }

    const subject =
      await updateSubject(
        id,
        validation.data
      )

    return {
      success: true,
      subject
    }
  }
)