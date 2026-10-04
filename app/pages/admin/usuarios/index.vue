<script setup>
import UserManager from '~/components/admin/users/UserManager.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useSeoMeta({
  title: 'Usuários — Conectar ENEM'
})
</script>

<template>
  <UserManager />
</template>
