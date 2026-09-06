import { defineEventHandler, readBody, createError } from "h3"
import prisma from "#server/utils/prisma"

export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const body = await readBody(event)

  const exists = await prisma.question.findUnique({
    where: { id },
    include: { options: true }
  })

  if (!exists) {
    throw createError({
      statusCode: 404,
      statusMessage: "Questão não encontrada"
    })
  }

  if (body.statement !== undefined && !body.statement.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Enunciado não pode ser vazio"
    })
  }

  // Update question base fields
  await prisma.question.update({
    where: { id },
    data: {
      subjectId: body.subjectId || exists.subjectId,
      title: body.title !== undefined ? (body.title?.trim() || null) : exists.title,
      statement: body.statement !== undefined ? body.statement.trim() : exists.statement,
      explanation: body.explanation !== undefined ? (body.explanation?.trim() || null) : exists.explanation,
      imageUrl: body.imageUrl !== undefined ? (body.imageUrl?.trim() || null) : exists.imageUrl,
      difficulty: body.difficulty || exists.difficulty,
      year: body.year !== undefined ? (body.year ? Number(body.year) : null) : exists.year,
      correctAnswer: body.correctAnswer || exists.correctAnswer,
      active: body.active !== undefined ? Boolean(body.active) : exists.active
    }
  })

  // Update options if provided
  if (Array.isArray(body.options) && body.options.length > 0) {
    // Delete existing options and recreate
    await prisma.questionOption.deleteMany({
      where: { questionId: id }
    })

    await prisma.questionOption.createMany({
      data: body.options.map(option => ({
        questionId: id,
        letter: option.letter,
        text: option.text?.trim() || ""
      }))
    })
  }

  const updatedQuestion = await prisma.question.findUnique({
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

  return {
    success: true,
    data: updatedQuestion,
    question: updatedQuestion
  }
})
