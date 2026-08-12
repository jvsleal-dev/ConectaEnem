import {
  createError,
  readBody
} from 'h3'

import { subjectSchema } from '#shared/validators/subject'
import { requireAdmin } from '#server/utils/require-admin.js'
import { createSubject } from '#server/services/subject.service'

export default defineEventHandler(
  async (event) => {
    await requireAdmin(event)

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
      await createSubject(
        validation.data
      )

    return {
      success: true,
      subject
    }
  }
)