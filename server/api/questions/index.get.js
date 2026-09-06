import { defineEventHandler, getQuery } from "h3"
import prisma from "#server/utils/prisma"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const where = {}

  if (query.subjectId) {
    where.subjectId = String(query.subjectId)
  }

  if (query.difficulty) {
    where.difficulty = String(query.difficulty)
  }

  if (query.year) {
    where.year = Number(query.year)
  }

  if (query.status === "ACTIVE") {
    where.active = true
  } else if (query.status === "INACTIVE") {
    where.active = false
  }

  if (query.search) {
    const searchStr = String(query.search).trim()
    if (searchStr) {
      where.OR = [
        { statement: { contains: searchStr } },
        { title: { contains: searchStr } }
      ]
    }
  }

  const questions = await prisma.question.findMany({
    where,
    include: {
      subject: true,
      options: {
        orderBy: {
          letter: "asc"
        }
      }
    },
    orderBy: [
      { year: "desc" },
      { createdAt: "desc" }
    ]
  })

  return {
    success: true,
    data: questions,
    questions
  }
})