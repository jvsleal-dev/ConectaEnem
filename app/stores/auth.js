import { defineStore } from 'pinia'

export const useAuthStore = defineStore(
  'auth',
  {
    state: () => ({
      user: null,
      loading: false,
      initialized: false
    }),

    getters: {
      isLoggedIn(state) {
        return !!state.user
      },

      isTeacher(state) {
        return state.user?.role === 'TEACHER'
      },

      isStudent(state) {
        return state.user?.role === 'STUDENT'
      }
    },

    actions: {
      setUser(user) {
        this.user = user
      },

      clearUser() {
        this.user = null
      }
    }
  }
)