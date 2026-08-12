import {
  createError,
  getRouterParam,
  readBody
} from 'h3'

import {
  moduleSchema
} from '#shared/validators/module.js'

import {
  requireAdmin
} from '#server/utils/require-admin.js'

import {
  updateModule
} from '#server/services/module.service.js'


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
      await updateModule(
        id,
        validation.data
      )


    return {
      success: true,
      module
    }
  }
)