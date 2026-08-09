import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: false,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!state.user
    },

    userId: (state) => {
      return state.user?.id ?? null
    },

    userRole: (state) => {
      return state.user?.role ?? null
    },

    isStudent() {
      return this.userRole === 'STUDENT'
    },

    isTeacher() {
      return this.userRole === 'TEACHER'
    },

    isAdmin() {
      return this.userRole === 'ADMIN'
    }
  },

  actions: {
    setUser(user) {
      this.user = user
    },

    setSession(session) {
      this.session = session
    },

    setLoading(value) {
      this.loading = value
    },

    setInitialized(value) {
      this.initialized = value
    },

    clearAuth() {
      this.user = null
      this.session = null
      this.loading = false
      this.initialized = false
    }
  }
})