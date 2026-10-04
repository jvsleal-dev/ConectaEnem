export default defineNuxtConfig({
  compatibilityDate: '2026-08-09',

  devtools: {
    enabled: true
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classPrefix: '',
    classSuffix: '',
    dataValue: 'theme',
    storageKey: 'conectar-enem-student-theme'
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/student-theme.css',
    '~/assets/css/admin.css'
  ],

  runtimeConfig: {
    public: {}
  },

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#7c3aed' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Conectar ENEM' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo conta.png' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/images/logo conta.png' }
      ]
    }
  }
})
