import { getQuery } from 'h3'
import { getAuthenticatedUser } from '#server/services/auth.service.js'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const query = getQuery(event)
  const subjectId = typeof query.subjectId === 'string' ? query.subjectId : undefined
  const search = typeof query.search === 'string' ? query.search.trim() : undefined

  const subjects = await prisma.subject.findMany({
    where: {
      active: true,
      ...(subjectId ? { id: subjectId } : {})
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      modules: {
        where: { active: true },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          order: true,
          lessons: {
            where: {
              active: true,
              ...(search ? {
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } }
                ]
              } : {})
            },
            orderBy: [{ order: 'asc' }, { title: 'asc' }],
            select: {
              id: true,
              title: true,
              description: true,
              videoUrl: true,
              order: true,
              progress: {
                where: { userId: user.id },
                select: { completed: true }
              }
            }
          }
        }
      }
    }
  })

  return {
    success: true,
    subjects
  }
})
