<script setup>
import QuestionManagement from '~/components/admin/questions/index.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useSeoMeta({
  title: 'Banco de Questões — Conectar ENEM Admin'
})
</script>

<template>
  <QuestionManagement />
</template>