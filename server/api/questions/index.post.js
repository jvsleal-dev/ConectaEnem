import { defineEventHandler, readBody, createError } from "h3"
import prisma from "#server/utils/prisma"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.statement || !body.statement.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Enunciado é obrigatório."
    })
  }

  if (!body.subjectId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Matéria é obrigatória."
    })
  }

  const rawOptions = Array.isArray(body.options) ? body.options : []
  const optionsData = rawOptions.map(option => ({
    letter: option.letter || "A",
    text: option.text?.trim() || ""
  }))

  const question = await prisma.question.create({
    data: {
      subjectId: body.subjectId,
      title: body.title?.trim() || null,
      statement: body.statement.trim(),
      explanation: body.explanation?.trim() || null,
      imageUrl: body.imageUrl?.trim() || null,
      difficulty: body.difficulty || "MEDIUM",
      year: body.year ? Number(body.year) : null,
      correctAnswer: body.correctAnswer || "A",
      active: body.active !== undefined ? Boolean(body.active) : true,
      options: {
        create: optionsData
      }
    },
    include: {
      options: {
        orderBy: {
          letter: "asc"
        }
      },
      subject: true
    }
  })

  return {
    success: true,
    data: question,
    question
  }
})