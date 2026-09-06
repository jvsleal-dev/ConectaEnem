import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import { updateClassroom } from '#server/services/classroom.service'

export default defineEventHandler(async (event) => {
  const user = await requireTeacher(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido.'
    })
  }

  const classroom = await updateClassroom(id, user.id, body)

  return {
    success: true,
    classroom
  }
})
