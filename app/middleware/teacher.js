import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (
    (authStore.user?.role === 'TEACHER' || authStore.user?.role === 'ADMIN') &&
    authStore.user?.active
  ) {
    return
  }

  try {
    const headers = import.meta.server
      ? useRequestHeaders(['cookie'])
      : undefined

    const response = await $fetch('/api/auth/me', {
      headers,
      credentials: 'include'
    })

    const user = response?.user

    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN') || !user.active) {
      authStore.clearUser()
      return navigateTo('/login')
    }

    authStore.setUser(user)
  } catch (error) {
    authStore.clearUser()
    return navigateTo('/login')
  }
})
