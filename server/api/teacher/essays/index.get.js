import { defineEventHandler, getQuery } from 'h3'
import { requireTeacher } from '#server/utils/require-teacher'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const teacher = await requireTeacher(event)
  const query = getQuery(event)

  const classroomId = query.classroomId || undefined
  const status = query.status || undefined // PENDING, CORRECTING, GRADED
  const search = query.search ? String(query.search).trim() : undefined

  // Buscar turmas que pertencem ao professor
  const teacherClassrooms = await prisma.classroom.findMany({
    where: { teacherId: teacher.id },
    select: { id: true, name: true, code: true }
  })

  const classroomIds = teacherClassrooms.map(c => c.id)

  if (classroomIds.length === 0) {
    return {
      success: true,
      essays: [],
      classrooms: [],
      stats: {
        total: 0,
        pending: 0,
        correcting: 0,
        graded: 0
      }
    }
  }

  // Montar filtro Prisma
  const where = {
    classroomId: classroomId ? classroomId : { in: classroomIds }
  }

  if (status && ['PENDING', 'CORRECTING', 'GRADED'].includes(status)) {
    where.status = status
  }

  if (search) {
    where.OR = [
      { theme: { contains: search } },
      { title: { contains: search } },
      { student: { name: { contains: search } } }
    ]
  }

  const [essays, pendingCount, correctingCount, gradedCount, totalCount] = await Promise.all([
    prisma.essay.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        classroom: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        correction: {
          select: {
            id: true,
            totalScore: true,
            c1Score: true,
            c2Score: true,
            c3Score: true,
            c4Score: true,
            c5Score: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.essay.count({
      where: { classroomId: { in: classroomIds }, status: 'PENDING' }
    }),
    prisma.essay.count({
      where: { classroomId: { in: classroomIds }, status: 'CORRECTING' }
    }),
    prisma.essay.count({
      where: { classroomId: { in: classroomIds }, status: 'GRADED' }
    }),
    prisma.essay.count({
      where: { classroomId: { in: classroomIds } }
    })
  ])

  return {
    success: true,
    essays,
    classrooms: teacherClassrooms,
    stats: {
      total: totalCount,
      pending: pendingCount,
      correcting: correctingCount,
      graded: gradedCount
    }
  }
})
