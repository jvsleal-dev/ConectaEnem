import {
  createError,
  readBody
} from 'h3'


import {
  registerSchema
} from '#shared/validators/auth'


import {
  registerUser
} from '#server/services/auth.service'



export default defineEventHandler(async (event)=>{


  const body =
    await readBody(event)



  const validation =
    registerSchema.safeParse(body)



  if(!validation.success){


    throw createError({

      statusCode:422,

      statusMessage:
        'Dados inválidos.',

      data:{
        errors:
          validation.error.flatten().fieldErrors
      }

    })


  }



  return registerUser({

    event,

    ...validation.data,

    role:'TEACHER'

  })


})