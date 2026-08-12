import { createError } from 'h3'

import prisma from '#server/utils/prisma'

function formatLesson(lesson) {
  return {
    id: lesson.id,

    moduleId: lesson.moduleId,

    title: lesson.title,

    description: lesson.description,

    videoUrl: lesson.videoUrl,

    order: lesson.order,

    active: lesson.active,

    module: lesson.module
      ? {
          id: lesson.module.id,
          subjectId: lesson.module.subjectId,
          name: lesson.module.name,
          slug: lesson.module.slug,

          subject: lesson.module.subject
            ? {
                id: lesson.module.subject.id,
                name: lesson.module.subject.name,
                slug: lesson.module.subject.slug
              }
            : null
        }
      : null,

    createdAt: lesson.createdAt,

    updatedAt: lesson.updatedAt
  }
}

async function findModule(moduleId) {
  const module = await prisma.module.findUnique({
    where: {
      id: moduleId
    }
  })

  if (!module) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Módulo não encontrado.'
    })
  }

  return module
}

function normalizeOrder(order, maximum) {
  if (!order) {
    return maximum
  }

  if (order < 1) {
    return 1
  }

  if (order > maximum) {
    return maximum
  }

  return order
}

export async function listLessons({
  moduleId
} = {}) {
  const lessons = await prisma.lesson.findMany({
    where: moduleId
      ? {
          moduleId
        }
      : undefined,

    include: {
      module: {
        include: {
          subject: true
        }
      }
    },

    orderBy: [
      {
        module: {
          subject: {
            order: 'asc'
          }
        }
      },
      {
        module: {
          order: 'asc'
        }
      },
      {
        order: 'asc'
      },
      {
        title: 'asc'
      }
    ]
  })

  return lessons.map(formatLesson)
}

export async function getLessonById(id) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id
    },

    include: {
      module: {
        include: {
          subject: true
        }
      }
    }
  })

  if (!lesson) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Aula não encontrada.'
    })
  }

  return formatLesson(lesson)
}

export async function createLesson(data) {
  await findModule(data.moduleId)

  const totalLessons = await prisma.lesson.count({
    where: {
      moduleId: data.moduleId
    }
  })

  const maximumOrder = totalLessons + 1

  const order = normalizeOrder(
    data.order,
    maximumOrder
  )

  const lesson = await prisma.$transaction(
    async (tx) => {
      await tx.lesson.updateMany({
        where: {
          moduleId: data.moduleId,

          order: {
            gte: order
          }
        },

        data: {
          order: {
            increment: 1
          }
        }
      })

      return await tx.lesson.create({
        data: {
          moduleId: data.moduleId,

          title: data.title.trim(),

          description:
            data.description?.trim() || null,

          videoUrl:
            data.videoUrl?.trim() || null,

          order,

          active:
            data.active ?? true
        },

        include: {
          module: {
            include: {
              subject: true
            }
          }
        }
      })
    }
  )

  return formatLesson(lesson)
}

export async function updateLesson(
  id,
  data
) {
  const existing = await prisma.lesson.findUnique({
    where: {
      id
    }
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Aula não encontrada.'
    })
  }

  await findModule(data.moduleId)

  const changingModule =
    existing.moduleId !== data.moduleId

  if (changingModule) {
    const targetModuleTotal =
      await prisma.lesson.count({
        where: {
          moduleId: data.moduleId
        }
      })

    const newOrder = normalizeOrder(
      data.order,
      targetModuleTotal + 1
    )

    const lesson = await prisma.$transaction(
      async (tx) => {
        await tx.lesson.updateMany({
          where: {
            moduleId: existing.moduleId,

            order: {
              gt: existing.order
            }
          },

          data: {
            order: {
              decrement: 1
            }
          }
        })

        await tx.lesson.updateMany({
          where: {
            moduleId: data.moduleId,

            order: {
              gte: newOrder
            }
          },

          data: {
            order: {
              increment: 1
            }
          }
        })

        return await tx.lesson.update({
          where: {
            id
          },

          data: {
            moduleId: data.moduleId,

            title: data.title.trim(),

            description:
              data.description?.trim() || null,

            videoUrl:
              data.videoUrl?.trim() || null,

            order: newOrder,

            active:
              data.active ?? true
          },

          include: {
            module: {
              include: {
                subject: true
              }
            }
          }
        })
      }
    )

    return formatLesson(lesson)
  }

  const totalLessons = await prisma.lesson.count({
    where: {
      moduleId: existing.moduleId
    }
  })

  const newOrder = normalizeOrder(
    data.order ?? existing.order,
    totalLessons
  )

  const lesson = await prisma.$transaction(
    async (tx) => {
      if (newOrder < existing.order) {
        await tx.lesson.updateMany({
          where: {
            moduleId: existing.moduleId,

            id: {
              not: id
            },

            order: {
              gte: newOrder,
              lt: existing.order
            }
          },

          data: {
            order: {
              increment: 1
            }
          }
        })
      }

      if (newOrder > existing.order) {
        await tx.lesson.updateMany({
          where: {
            moduleId: existing.moduleId,

            id: {
              not: id
            },

            order: {
              gt: existing.order,
              lte: newOrder
            }
          },

          data: {
            order: {
              decrement: 1
            }
          }
        })
      }

      return await tx.lesson.update({
        where: {
          id
        },

        data: {
          title: data.title.trim(),

          description:
            data.description?.trim() || null,

          videoUrl:
            data.videoUrl?.trim() || null,

          order: newOrder,

          active:
            data.active ?? true
        },

        include: {
          module: {
            include: {
              subject: true
            }
          }
        }
      })
    }
  )

  return formatLesson(lesson)
}

export async function deleteLesson(id) {
  const existing = await prisma.lesson.findUnique({
    where: {
      id
    }
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Aula não encontrada.'
    })
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.lesson.delete({
        where: {
          id
        }
      })

      await tx.lesson.updateMany({
        where: {
          moduleId: existing.moduleId,

          order: {
            gt: existing.order
          }
        },

        data: {
          order: {
            decrement: 1
          }
        }
      })
    }
  )

  return true
}