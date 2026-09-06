import { defineEventHandler } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [
    totalStudents,
    totalTeachers,
    totalQuestions,
    totalSubjects,
    totalModules,
    totalLessons,
    totalEssays,
    recentStudents,
    recentEssays
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.question.count(),
    prisma.subject.count(),
    prisma.module.count(),
    prisma.lesson.count(),
    prisma.essay.count(),
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    prisma.essay.findMany({
      include: {
        student: { select: { name: true, email: true } },
        classroom: { select: { name: true } },
        correction: { select: { totalScore: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  return {
    success: true,
    stats: {
      totalStudents,
      totalTeachers,
      totalQuestions,
      totalSubjects,
      totalModules,
      totalLessons,
      totalEssays
    },
    recentStudents,
    recentEssays
  }
})
