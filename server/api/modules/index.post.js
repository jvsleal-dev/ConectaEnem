import {
  createError,
  readBody
} from 'h3'

import {
  moduleSchema
} from '#shared/validators/module.js'

import {
  requireAdmin
} from '#server/utils/require-admin.js'

import {
  createModule
} from '#server/services/module.service.js'


export default defineEventHandler(
  async (event) => {
    await requireAdmin(event)


    const body =
      await readBody(event)


    const validation =
      moduleSchema.safeParse(body)


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


    const module =
      await createModule(
        validation.data
      )


    return {
      success: true,
      module
    }
  }
)