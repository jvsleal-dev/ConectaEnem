import { defineEventHandler, getQuery } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const role = query.role ? String(query.role).toUpperCase() : undefined

  const where = {}
  if (role && ['STUDENT', 'TEACHER', 'ADMIN'].includes(role)) {
    where.role = role
  } else {
    // Retorna estudantes e professores por padrão na listagem de usuários do admin
    where.role = { in: ['STUDENT', 'TEACHER'] }
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      enrollments: {
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
      classroomsLed: {
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              members: true
            }
          }
        }
      },
      _count: {
        select: {
          essaysSubmitted: true,
          essaysGraded: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return {
    success: true,
    users: users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      active: u.active,
      createdAt: u.createdAt,
      essaysCount: u._count.essaysSubmitted,
      gradedCount: u._count.essaysGraded,
      classrooms: u.role === 'STUDENT'
        ? u.enrollments.map(m => ({
            id: m.classroom.id,
            name: m.classroom.name,
            teacherName: m.classroom.teacher?.name || 'Professor'
          }))
        : u.classroomsLed.map(c => ({
            id: c.id,
            name: c.name,
            studentsCount: c._count.members
          }))
    }))
  }
})
