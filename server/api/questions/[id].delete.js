import { defineEventHandler, createError } from "h3"
import prisma from "#server/utils/prisma"

export default defineEventHandler(async (event) => {
  const id = event.context.params.id

  const exists = await prisma.question.findUnique({
    where: { id }
  })

  if (!exists) {
    throw createError({
      statusCode: 404,
      statusMessage: "Questão não encontrada."
    })
  }

  await prisma.question.delete({
    where: { id }
  })

  return {
    success: true,
    message: "Questão removida com sucesso."
  }
})