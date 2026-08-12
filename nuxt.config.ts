export default defineNuxtConfig({
  compatibilityDate: '2026-08-09',

  devtools: {
    enabled: true
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabasePublishableKey: ''
    }
  },

  routeRules: {
    '/': {
      prerender: true
    }
  }
})