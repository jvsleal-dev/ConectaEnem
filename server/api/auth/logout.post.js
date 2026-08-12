import {
  logoutUser
} from '#server/services/auth.service'


export default defineEventHandler(async (event) => {

  return logoutUser(event)

})