import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    loading: false
  }),

  getters: {
    name: (state) => {
      return state.profile?.name ?? ''
    },

    email: (state) => {
      return state.profile?.email ?? ''
    },

    avatar: (state) => {
      return state.profile?.avatarUrl ?? null
    },

    role: (state) => {
      return state.profile?.role ?? null
    }
  },

  actions: {
    setProfile(profile) {
      this.profile = profile
    },

    updateProfile(data) {
      if (!this.profile) {
        this.profile = data
        return
      }

      this.profile = {
        ...this.profile,
        ...data
      }
    },

    setLoading(value) {
      this.loading = value
    },

    clearProfile() {
      this.profile = null
      this.loading = false
    }
  }
})