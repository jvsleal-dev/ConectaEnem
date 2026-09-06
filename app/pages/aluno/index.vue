<script setup>
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'aluno'
})

useSeoMeta({
  title: 'Início — Área do Aluno | Conectar ENEM'
})

const authStore = useAuthStore()
const { getMe } = useAuth()

const userName = computed(() => {
  const name = authStore.user?.name?.trim()
  if (!name) return 'Aluno'
  return name.split(/\s+/)[0]
})

const generalActions = [
  {
    title: 'Laboratório de Redação',
    description: 'Escreva novas redações, veja repertórios e consulte suas notas.',
    icon: 'edit_note',
    to: '/aluno/redacao'
  },
  {
    title: 'Banco de Questões',
    description: 'Pratique com questões comentadas do ENEM por disciplina.',
    icon: 'quiz',
    to: '/aluno/questoes'
  },
  {
    title: 'Aulas & Módulos',
    description: 'Assista a videoaulas preparatórias e cronogramas.',
    icon: 'play_lesson',
    to: '/aluno/aulas'
  }
]

onMounted(() => {
  if (!authStore.user) {
    getMe().catch(() => null)
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8">
    <!-- HERO BANNER CARD -->
    <section class="relative overflow-hidden rounded-3xl bg-[var(--student-primary-solid)] p-8 text-white shadow-xl shadow-purple-900/15 sm:p-10">
      <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-950/20 blur-2xl"></div>

      <div class="relative flex flex-col items-center justify-center text-center py-4 sm:py-6">
        <div class="flex items-center gap-3.5">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-white/90 shadow-lg shadow-black/10 p-1">
            <img
              src="/images/logo conta.png"
              alt="Logo Conectar ENEM"
              class="h-full w-full object-contain"
            />
          </div>
          <span class="text-3xl font-black tracking-tight sm:text-4xl">
            conectar<span class="text-purple-200">ENEM</span>
          </span>
        </div>

        <p class="mt-4 max-w-md text-xs font-semibold text-purple-100 sm:text-sm">
          Sua plataforma 100% gratuita para redação nota 1000, questões e aulas preparatórias.
        </p>
      </div>
    </section>

    <!-- SAUDAÇÃO -->
    <section class="mt-8">
      <h2 class="text-lg font-medium text-[var(--student-text)] sm:text-xl">
        Bem-vindo de volta, <strong class="font-black text-[var(--student-text)]">{{ userName }}</strong>!
      </h2>
    </section>

    <!-- LISTA DE CARDS GERAIS -->
    <section class="mt-5 space-y-3.5">
      <NuxtLink
        v-for="card in generalActions"
        :key="card.title"
        :to="card.to"
        class="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--student-primary-solid)] hover:shadow-md hover:shadow-purple-700/5 cursor-pointer"
      >
        <div class="flex items-center gap-4 min-w-0">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--student-primary-soft)] text-[var(--student-primary-text)] transition group-hover:scale-105 group-hover:bg-[var(--student-primary-solid)] group-hover:text-white">
            <span class="material-symbols-rounded text-2xl">
              {{ card.icon }}
            </span>
          </div>

          <div class="min-w-0">
            <h3 class="text-base font-bold text-[var(--student-text)] transition group-hover:text-[var(--student-primary-text)]">
              {{ card.title }}
            </h3>
            <p class="mt-0.5 text-xs text-[var(--student-text-secondary)] truncate sm:text-sm">
              {{ card.description }}
            </p>
          </div>
        </div>

        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--student-text-muted)] transition group-hover:text-[var(--student-primary-text)] group-hover:translate-x-1">
          <span class="material-symbols-rounded text-2xl">
            chevron_right
          </span>
        </div>
      </NuxtLink>
    </section>
  </div>
</template>