<script setup>
import AuthPanel from '~/components/auth/AuthPanel.vue'
import AdminLoginForm from '~/components/admin/AdminLoginForm.vue'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Acesso Administrativo — Conectar ENEM',
  description: 'Área administrativa do Conectar ENEM.'
})
</script>

<template>
  <AuthPanel
    title="Gestão do Conectar ENEM."
    description="Gerencie aulas, materiais, questões e demais conteúdos da plataforma."
    footer-text="Acesso restrito à equipe administrativa."
  >
    <AdminLoginForm />
  </AuthPanel>
</template>