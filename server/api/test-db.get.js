import prisma from '#server/utils/prisma'


export default defineEventHandler(async () => {


  const result =
    await prisma.user.count()


  return {

    database:true,

    users:result

  }


})