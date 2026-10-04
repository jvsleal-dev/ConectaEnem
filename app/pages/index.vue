<script setup>
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const { getMe } = useAuth()

onMounted(async () => {
  try {
    const user = await getMe()
    if (user && user.active) {
      if (user.role === 'TEACHER') {
        navigateTo('/professor')
      } else if (user.role === 'ADMIN') {
        navigateTo('/admin')
      } else {
        navigateTo('/aluno')
      }
    }
  } catch (e) {
    // Não logado, permanece na landing page
  }
})
</script>


<template>

  <div>

    <LandingHeader />

    <LandingHero />

    <LandingFeatures />

    <LandingHowItWorks />

    <LandingEssay />

    <LandingCta />

    <LandingFooter />

  </div>

</template>