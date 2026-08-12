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
  subjectId,
  name,
  ignoreId = null
) {
  const baseSlug =
    createSlug(name) || 'modulo'

  let slug = baseSlug
  let number = 2

  while (true) {
    const existing =
      await prisma.module.findFirst({
        where: {
          subjectId,
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


function formatModule(module) {
  return {
    id: module.id,
    subjectId: module.subjectId,

    name: module.name,
    slug: module.slug,

    description: module.description,

    order: module.order,
    active: module.active,

    subject: module.subject
      ? {
          id: module.subject.id,
          name: module.subject.name,
          slug: module.subject.slug
        }
      : null,

    createdAt: module.createdAt,
    updatedAt: module.updatedAt
  }
}


export async function listModules({
  subjectId
} = {}) {
  const modules =
    await prisma.module.findMany({
      where: subjectId
        ? {
            subjectId
          }
        : undefined,

      include: {
        subject: true
      },

      orderBy: [
        {
          subject: {
            order: 'asc'
          }
        },
        {
          order: 'asc'
        },
        {
          name: 'asc'
        }
      ]
    })

  return modules.map(formatModule)
}


export async function getModuleById(id) {
  const module =
    await prisma.module.findUnique({
      where: {
        id
      },

      include: {
        subject: true
      }
    })

  if (!module) {
    throw createError({
      statusCode: 404,
      statusMessage:
        'Módulo não encontrado.'
    })
  }

  return formatModule(module)
}


export async function createModule(data) {
  /*
   * Primeiro verificamos se a matéria
   * realmente existe.
   */
  const subject =
    await prisma.subject.findUnique({
      where: {
        id: data.subjectId
      }
    })

  if (!subject) {
    throw createError({
      statusCode: 404,
      statusMessage:
        'Matéria não encontrada.'
    })
  }


  const name =
    data.name.trim()


  const slug =
    await generateUniqueSlug(
      data.subjectId,
      name
    )


  const module =
    await prisma.module.create({
      data: {
        subjectId:
          data.subjectId,

        name,

        slug,

        description:
          data.description?.trim() ||
          null,

        order:
          data.order ?? 0,

        active:
          data.active ?? true
      },

      include: {
        subject: true
      }
    })


  return formatModule(module)
}


export async function updateModule(
  id,
  data
) {
  const existing =
    await prisma.module.findUnique({
      where: {
        id
      }
    })


  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage:
        'Módulo não encontrado.'
    })
  }


  /*
   * Confirma que a nova matéria existe.
   */
  const subject =
    await prisma.subject.findUnique({
      where: {
        id: data.subjectId
      }
    })


  if (!subject) {
    throw createError({
      statusCode: 404,
      statusMessage:
        'Matéria não encontrada.'
    })
  }


  const name =
    data.name.trim()


  const needsNewSlug =
    name !== existing.name ||
    data.subjectId !==
      existing.subjectId


  const slug =
    needsNewSlug
      ? await generateUniqueSlug(
          data.subjectId,
          name,
          id
        )
      : existing.slug


  const module =
    await prisma.module.update({
      where: {
        id
      },

      data: {
        subjectId:
          data.subjectId,

        name,

        slug,

        description:
          data.description?.trim() ||
          null,

        order:
          data.order ?? 0,

        active:
          data.active ?? true
      },

      include: {
        subject: true
      }
    })


  return formatModule(module)
  
}
export async function deleteModule(id) {

  const existing =
    await prisma.module.findUnique({
      where: {
        id
      }
    })


  if (!existing) {

    throw createError({

      statusCode:404,

      statusMessage:
        'Módulo não encontrado.'

    })

  }


  await prisma.module.delete({

    where:{
      id
    }

  })


  return true

}