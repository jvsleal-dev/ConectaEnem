import { requireAdmin } from '#server/utils/require-admin.js'
import { listSubjects } from '#server/services/subject.service'

export default defineEventHandler(
  async (event) => {
    await requireAdmin(event)

    const subjects =
      await listSubjects()

    return {
      subjects
    }
  }
)