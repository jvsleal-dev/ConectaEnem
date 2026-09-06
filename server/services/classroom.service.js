import { customAlphabet } from 'nanoid'
import { createError } from 'h3'
import prisma from '#server/utils/prisma'

const generateCode = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)

export async function listTeacherClassrooms(teacherId) {
  const classrooms = await prisma.classroom.findMany({
    where: {
      teacherId
    },
    include: {
      _count: {
        select: {
          members: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return classrooms.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description,
    code: c.code,
    inviteToken: c.inviteToken,
    maxStudents: c.maxStudents,
    expiresAt: c.expiresAt,
    active: c.active,
    studentsCount: c._count.members,
    isExpired: c.expiresAt ? new Date(c.expiresAt) < new Date() : false,
    isFull: c.maxStudents ? c._count.members >= c.maxStudents : false,
    createdAt: c.createdAt
  }))
}

export async function createClassroom({
  teacherId,
  name,
  description,
  maxStudents,
  expiresAt
}) {
  let code = generateCode()
  let exists = await prisma.classroom.findUnique({ where: { code } })
  while (exists) {
    code = generateCode()
    exists = await prisma.classroom.findUnique({ where: { code } })
  }

  const classroom = await prisma.classroom.create({
    data: {
      teacherId,
      name: name.trim(),
      description: description?.trim() || null,
      code,
      maxStudents: maxStudents ? parseInt(maxStudents, 10) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: true
    }
  })

  return classroom
}

export async function getClassroomDetails(classroomId, teacherId) {
  const classroom = await prisma.classroom.findFirst({
    where: {
      id: classroomId,
      teacherId
    },
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
        orderBy: {
          joinedAt: 'desc'
        }
      }
    }
  })

  if (!classroom) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Turma não encontrada.'
    })
  }

  return {
    ...classroom,
    studentsCount: classroom.members.length,
    isExpired: classroom.expiresAt ? new Date(classroom.expiresAt) < new Date() : false,
    isFull: classroom.maxStudents ? classroom.members.length >= classroom.maxStudents : false
  }
}

export async function updateClassroom(classroomId, teacherId, data) {
  const classroom = await prisma.classroom.findFirst({
    where: {
      id: classroomId,
      teacherId
    }
  })

  if (!classroom) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Turma não encontrada.'
    })
  }

  return await prisma.classroom.update({
    where: { id: classroomId },
    data: {
      name: data.name?.trim(),
      description: data.description?.trim() || null,
      maxStudents: data.maxStudents ? parseInt(data.maxStudents, 10) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      active: data.active !== undefined ? Boolean(data.active) : classroom.active
    }
  })
}

export async function deleteClassroom(classroomId, teacherId) {
  const classroom = await prisma.classroom.findFirst({
    where: {
      id: classroomId,
      teacherId
    }
  })

  if (!classroom) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Turma não encontrada.'
    })
  }

  return await prisma.classroom.delete({
    where: { id: classroomId }
  })
}

export async function removeClassroomStudent(classroomId, teacherId, studentId) {
  const classroom = await prisma.classroom.findFirst({
    where: {
      id: classroomId,
      teacherId
    }
  })

  if (!classroom) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Turma não encontrada.'
    })
  }

  return await prisma.classroomMember.deleteMany({
    where: {
      classroomId,
      studentId
    }
  })
}

export async function getInviteInfo(tokenOrCode) {
  const classroom = await prisma.classroom.findFirst({
    where: {
      OR: [
        { inviteToken: tokenOrCode },
        { code: tokenOrCode }
      ]
    },
    include: {
      teacher: {
        select: {
          id: true,
          name: true
        }
      },
      _count: {
        select: {
          members: true
        }
      }
    }
  })

  if (!classroom) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Convite ou turma inválida.'
    })
  }

  const isExpired = classroom.expiresAt ? new Date(classroom.expiresAt) < new Date() : false
  const isFull = classroom.maxStudents ? classroom._count.members >= classroom.maxStudents : false

  return {
    id: classroom.id,
    name: classroom.name,
    description: classroom.description,
    teacherName: classroom.teacher.name,
    maxStudents: classroom.maxStudents,
    currentStudents: classroom._count.members,
    expiresAt: classroom.expiresAt,
    active: classroom.active,
    isExpired,
    isFull,
    canJoin: classroom.active && !isExpired && !isFull
  }
}

export async function joinClassroomByInvite(tokenOrCode, studentId) {
  const classroom = await prisma.classroom.findFirst({
    where: {
      OR: [
        { inviteToken: tokenOrCode },
        { code: tokenOrCode }
      ]
    },
    include: {
      _count: {
        select: {
          members: true
        }
      }
    }
  })

  if (!classroom) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Turma não encontrada com o link fornecido.'
    })
  }

  if (!classroom.active) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Esta turma está temporariamente inativa.'
    })
  }

  if (classroom.expiresAt && new Date(classroom.expiresAt) < new Date()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O link de convite desta turma expirou.'
    })
  }

  if (classroom.maxStudents && classroom._count.members >= classroom.maxStudents) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Esta turma já atingiu o número máximo de alunos permitido.'
    })
  }

  // Verificar se o aluno já participa
  const existingMember = await prisma.classroomMember.findUnique({
    where: {
      classroomId_studentId: {
        classroomId: classroom.id,
        studentId
      }
    }
  })

  if (existingMember) {
    return {
      alreadyMember: true,
      classroom: {
        id: classroom.id,
        name: classroom.name
      }
    }
  }

  await prisma.classroomMember.create({
    data: {
      classroomId: classroom.id,
      studentId
    }
  })

  return {
    success: true,
    classroom: {
      id: classroom.id,
      name: classroom.name
    }
  }
}
