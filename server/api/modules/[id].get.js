import {
  createError,
  getRouterParam
} from 'h3'

import {
  requireAdmin
} from '#server/utils/require-admin.js'

import {
  getModuleById
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


    const module =
      await getModuleById(id)


    return {
      module
    }
  }
)