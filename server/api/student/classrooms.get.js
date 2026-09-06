import { defineEventHandler } from 'h3'
import { getAuthenticatedUser } from '#server/services/auth.service'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const memberships = await prisma.classroomMember.findMany({
    where: { studentId: user.id },
    include: {
      classroom: {
        select: {
          id: true,
          name: true,
          code: true,
          teacher: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  return {
    success: true,
    classrooms: memberships.map(m => ({
      id: m.classroom.id,
      name: m.classroom.name,
      code: m.classroom.code,
      teacherName: m.classroom.teacher.name
    }))
  }
})
