import { defineEventHandler, getRouterParam, createError } from 'h3'
import { requireAdmin } from '#server/utils/require-admin'
import prisma from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const currentAdmin = await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do usuário não fornecido.'
    })
  }

  // Prevenir que o admin se delete a si mesmo
  if (currentAdmin.id === id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Você não pode excluir sua própria conta de administrador.'
    })
  }

  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, name: true }
  })

  if (!targetUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuário não encontrado.'
    })
  }

  // Deletar o usuário (as relações com onDelete: Cascade serão removidas, sessões e contas vinculadas)
  await prisma.user.delete({
    where: { id }
  })

  return {
    success: true,
    message: `Usuário "${targetUser.name}" foi excluído com sucesso.`
  }
})
