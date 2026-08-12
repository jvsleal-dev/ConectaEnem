import {
  createError,
  readBody
} from 'h3'


import {
  loginSchema
} from '#shared/validators/auth'


import {
  loginUser
} from '#server/services/auth.service'



export default defineEventHandler(async(event)=>{


  const body =
    await readBody(event)



  const validation =
    loginSchema.safeParse(body)



  if(!validation.success){


    throw createError({

      statusCode:422,

      statusMessage:
        'Dados inválidos.'

    })


  }



  return loginUser({

    event,

    email:
      validation.data.email,

    password:
      validation.data.password,

    role:
      validation.data.role

  })


})