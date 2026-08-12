import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  async function registerStudent(payload) {
    const response = await $fetch(
      '/api/auth/register/student',
      {
        method: 'POST',
        body: payload
      }
    )

    if (response.user) {
      authStore.setUser(response.user)
    }

    return response
  }

  async function registerTeacher(payload) {
    const response = await $fetch(
      '/api/auth/register/teacher',
      {
        method: 'POST',
        body: payload
      }
    )

    if (response.user) {
      authStore.setUser(response.user)
    }

    return response
  }

  async function login(payload) {
    const response = await $fetch(
      '/api/auth/login',
      {
        method: 'POST',
        body: payload
      }
    )

    if (response.user) {
      authStore.setUser(response.user)
    }

    return response
  }

  async function loginAdmin(payload) {
    const response = await $fetch(
      '/api/auth/admin-login',
      {
        method: 'POST',
        body: payload
      }
    )

    if (response.user) {
      authStore.setUser(response.user)
    }

    return response
  }

  async function logout() {
    await $fetch(
      '/api/auth/logout',
      {
        method: 'POST'
      }
    )

    authStore.clearUser()
  }

  async function getMe() {
    const response = await $fetch(
      '/api/auth/me'
    )

    authStore.setUser(response.user)

    return response.user
  }

  return {
    registerStudent,
    registerTeacher,
    login,
    loginAdmin,
    logout,
    getMe
  }
}