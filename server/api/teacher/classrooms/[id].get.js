import { defineEventHandler, getRouterParam, createError } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import { getClassroomDetails } from '#server/services/classroom.service'

export default defineEventHandler(async (event) => {
  const user = await requireTeacher(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido.'
    })
  }

  const classroom = await getClassroomDetails(id, user.id)

  return {
    success: true,
    classroom
  }
})
