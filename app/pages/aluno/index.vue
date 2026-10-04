<script setup>
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'aluno',
  middleware: 'auth'
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
  <div class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
    <!-- HERO BANNER COM GRADIENTE & VIDRO -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 p-8 text-white shadow-xl shadow-purple-900/15 sm:p-10">
      <div class="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-purple-950/30 blur-2xl"></div>

      <div class="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-3 text-center md:text-left">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-purple-100 backdrop-blur-md">
            <span class="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Plataforma 100% Gratuita para o ENEM
          </div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Olá, <span class="text-purple-200">{{ userName }}</span>! Pronto para estudar?
          </h1>
          <p class="max-w-xl text-xs sm:text-sm font-medium text-purple-100/90 leading-relaxed">
            Pratique com redações ilimitadas, resolva questões oficiais comentadas e assista às aulas para garantir sua vaga na faculdade.
          </p>
        </div>

        <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-2">
          <img
            src="/images/logo conta.png"
            alt="Logo Conectar ENEM"
            class="h-full w-full object-contain filter drop-shadow-md"
          />
        </div>
      </div>
    </section>

    <!-- TRILHAS DE ESTUDO & FERRAMENTAS -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg sm:text-xl font-black tracking-tight text-[var(--student-text)]">
            Ferramentas de Aprendizado
          </h2>
          <p class="text-xs text-[var(--student-text-secondary)] mt-0.5">
            Acesse rapidamente as principais áreas de treino e estudo
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          v-for="card in generalActions"
          :key="card.title"
          :to="card.to"
          class="group relative flex flex-col justify-between rounded-2xl border border-[var(--student-border)] bg-[var(--student-surface)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--student-primary-solid)] hover:shadow-lg hover:shadow-purple-700/5 cursor-pointer"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--student-primary-soft)] text-[var(--student-primary-text)] transition-all duration-200 group-hover:scale-110 group-hover:bg-[var(--student-primary-solid)] group-hover:text-white">
                <span class="material-symbols-rounded text-2xl">
                  {{ card.icon }}
                </span>
              </div>
              <span class="material-symbols-rounded text-[var(--student-text-muted)] text-xl transition-transform group-hover:translate-x-1 group-hover:text-[var(--student-primary-text)]">
                arrow_forward
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="text-base font-bold text-[var(--student-text)] group-hover:text-[var(--student-primary-text)] transition-colors">
                {{ card.title }}
              </h3>
              <p class="text-xs text-[var(--student-text-secondary)] leading-relaxed">
                {{ card.description }}
              </p>
            </div>
          </div>

          <div class="mt-5 flex items-center gap-1 text-xs font-bold text-[var(--student-primary-text)]">
            <span>Acessar agora</span>
            <span class="material-symbols-rounded text-sm">chevron_right</span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>