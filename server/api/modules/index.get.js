import { getQuery } from 'h3'

import { requireAdmin } from '#server/utils/require-admin.js'

import {
  listModules
} from '#server/services/module.service.js'


export default defineEventHandler(
  async (event) => {
    await requireAdmin(event)

    const query =
      getQuery(event)

    const subjectId =
      typeof query.subjectId === 'string'
        ? query.subjectId
        : undefined


    const modules =
      await listModules({
        subjectId
      })


    return {
      modules
    }
  }
)