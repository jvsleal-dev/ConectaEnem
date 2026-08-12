import { createError } from 'h3'

import prisma from '#server/utils/prisma'


function createSlug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}


async function generateUniqueSlug(
  name,
  ignoreId = null
) {
  const baseSlug =
    createSlug(name) || 'materia'

  let slug = baseSlug
  let number = 2

  while (true) {
    const existing =
      await prisma.subject.findUnique({
        where: {
          slug
        }
      })

    if (
      !existing ||
      existing.id === ignoreId
    ) {
      return slug
    }

    slug = `${baseSlug}-${number}`
    number++
  }
}


function formatSubject(subject) {
  return {
    id: subject.id,
    name: subject.name,
    slug: subject.slug,
    description: subject.description,
    order: subject.order,
    active: subject.active,
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt
  }
}


export async function listSubjects() {
  const subjects =
    await prisma.subject.findMany({
      orderBy: [
        {
          order: 'asc'
        },
        {
          name: 'asc'
        }
      ]
    })

  return subjects.map(formatSubject)
}


export async function getSubjectById(id) {
  const subject =
    await prisma.subject.findUnique({
      where: {
        id
      }
    })

  if (!subject) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Matéria não encontrada.'
    })
  }

  return formatSubject(subject)
}


export async function createSubject(data) {
  const name = data.name.trim()

  const slug =
    await generateUniqueSlug(name)

  const subject =
    await prisma.subject.create({
      data: {
        name,

        slug,

        description:
          data.description?.trim() || null,

        order:
          data.order ?? 0,

        active:
          data.active ?? true
      }
    })

  return formatSubject(subject)
}


export async function updateSubject(
  id,
  data
) {
  const existing =
    await prisma.subject.findUnique({
      where: {
        id
      }
    })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Matéria não encontrada.'
    })
  }

  const name = data.name.trim()

  const slug =
    name !== existing.name
      ? await generateUniqueSlug(
          name,
          id
        )
      : existing.slug

  const subject =
    await prisma.subject.update({
      where: {
        id
      },

      data: {
        name,

        slug,

        description:
          data.description?.trim() || null,

        order:
          data.order ?? 0,

        active:
          data.active ?? true
      }
    })

  return formatSubject(subject)
}