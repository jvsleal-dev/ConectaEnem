import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(
async () => {

  const authStore =
    useAuthStore()


  /*
    Se já temos um administrador
    carregado no Pinia, não consulta
    a API novamente.
  */
  if (
    authStore.user?.role === 'ADMIN' &&
    authStore.user?.active
  ) {

    return

  }



  try {


    const headers =
      import.meta.server
        ? useRequestHeaders(['cookie'])
        : undefined



    const response =
      await $fetch(
        '/api/auth/me',
        {
          headers,

          /*
            Evita cache errado no SSR
            e mantém a validação correta.
          */
          credentials: 'include'
        }
      )



    const user =
      response?.user



    if (
      !user ||
      user.role !== 'ADMIN' ||
      !user.active
    ) {


      authStore.clearUser()


      return navigateTo(
        '/acesso-admin'
      )

    }



    authStore.setUser(user)



  }
  catch (error) {


    console.error(
      'Erro ao validar administrador:',
      error
    )


    authStore.clearUser()


    return navigateTo(
      '/acesso-admin'
    )


  }

})