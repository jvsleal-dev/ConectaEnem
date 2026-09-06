import { defineEventHandler, createError } from "h3"
import prisma from "#server/utils/prisma"

export default defineEventHandler(async (event) => {
  const id = event.context.params.id

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      subject: true,
      options: {
        orderBy: {
          letter: "asc"
        }
      }
    }
  })

  if (!question) {
    throw createError({
      statusCode: 404,
      statusMessage: "Questão não encontrada."
    })
  }

  return {
    success: true,
    data: question,
    question
  }
})