import { defineEventHandler } from 'h3'
import { getAuthenticatedUser } from '#server/services/auth.service.js'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const lessonId = event.context.params.id

  // Check if lesson exists
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId }
  })

  if (!lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Aula não encontrada' })
  }

  // Check if progress already exists
  const existingProgress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: lessonId
      }
    }
  })

  if (existingProgress) {
    // If it exists, toggle completion or delete it? Let's toggle `completed`
    const updated = await prisma.lessonProgress.update({
      where: { id: existingProgress.id },
      data: { completed: !existingProgress.completed }
    })
    return { success: true, completed: updated.completed }
  } else {
    // If it doesn't exist, create it as completed
    await prisma.lessonProgress.create({
      data: {
        userId: user.id,
        lessonId: lessonId,
        completed: true
      }
    })
    return { success: true, completed: true }
  }
})
