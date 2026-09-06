import { defineEventHandler } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      id: true,
      name: true,
      email: true,
      active: true,
      createdAt: true,
      classroomMemberships: {
        include: {
          classroom: {
            select: {
              id: true,
              name: true,
              teacher: {
                select: { name: true }
              }
            }
          }
        }
      },
      _count: {
        select: {
          studentEssays: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    students: students.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      active: s.active,
      createdAt: s.createdAt,
      essaysCount: s._count.studentEssays,
      classrooms: s.classroomMemberships.map(m => ({
        id: m.classroom.id,
        name: m.classroom.name,
        teacherName: m.classroom.teacher.name
      }))
    }))
  }
})
