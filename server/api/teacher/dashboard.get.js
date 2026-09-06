import { defineEventHandler } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireTeacher(event)

  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: user.id },
    include: {
      members: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true
            }
          }
        },
        orderBy: { joinedAt: 'desc' }
      },
      _count: {
        select: { members: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const classroomIds = classrooms.map(c => c.id)

  const totalClassrooms = classrooms.length
  const activeClassrooms = classrooms.filter(c => c.active && (!c.expiresAt || new Date(c.expiresAt) > new Date())).length
  const totalStudents = classrooms.reduce((acc, c) => acc + c._count.members, 0)

  // Contar redações pendentes de correção
  const pendingCorrections = classroomIds.length > 0
    ? await prisma.essay.count({
        where: {
          classroomId: { in: classroomIds },
          status: { in: ['PENDING', 'CORRECTING'] }
        }
      })
    : 0

  // Coletar alunos recentes matriculados
  const recentStudents = []
  classrooms.forEach(c => {
    c.members.forEach(m => {
      recentStudents.push({
        id: m.student.id,
        name: m.student.name,
        email: m.student.email,
        classroomId: c.id,
        classroomName: c.name,
        joinedAt: m.joinedAt
      })
    })
  })

  recentStudents.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))

  return {
    success: true,
    stats: {
      totalClassrooms,
      activeClassrooms,
      totalStudents,
      pendingCorrections
    },
    recentClassrooms: classrooms.slice(0, 4).map(c => ({
      id: c.id,
      name: c.name,
      code: c.code,
      inviteToken: c.inviteToken,
      studentsCount: c._count.members,
      maxStudents: c.maxStudents,
      active: c.active,
      createdAt: c.createdAt
    })),
    recentStudents: recentStudents.slice(0, 5)
  }
})
