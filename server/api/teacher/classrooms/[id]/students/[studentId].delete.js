import { defineEventHandler, getRouterParam, createError } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import { removeClassroomStudent } from '#server/services/classroom.service'

export default defineEventHandler(async (event) => {
  const user = await requireTeacher(event)
  const id = getRouterParam(event, 'id')
  const studentId = getRouterParam(event, 'studentId')

  if (!id || !studentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parâmetros inválidos.'
    })
  }

  await removeClassroomStudent(id, user.id, studentId)

  return {
    success: true
  }
})
