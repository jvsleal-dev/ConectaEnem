import {
  setHeader
} from 'h3'


import {
  getAuthenticatedUser
} from '#server/services/auth.service'


export default defineEventHandler(async (event) => {


  setHeader(
    event,
    'Cache-Control',
    'private, no-store'
  )


  const user =
    await getAuthenticatedUser(event)



  return {

    user

  }


})