import { defineEventHandler } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import { listTeacherClassrooms } from '#server/services/classroom.service'

export default defineEventHandler(async (event) => {
  const user = await requireTeacher(event)
  const classrooms = await listTeacherClassrooms(user.id)

  return {
    success: true,
    classrooms
  }
})
