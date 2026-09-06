import { defineEventHandler, readBody, createError } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import { createClassroom } from '#server/services/classroom.service'

export default defineEventHandler(async (event) => {
  const user = await requireTeacher(event)
  const body = await readBody(event)

  if (!body.name || !body.name.trim()) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Informe o nome da turma.'
    })
  }

  const classroom = await createClassroom({
    teacherId: user.id,
    name: body.name,
    description: body.description,
    maxStudents: body.maxStudents,
    expiresAt: body.expiresAt
  })

  return {
    success: true,
    classroom
  }
})
