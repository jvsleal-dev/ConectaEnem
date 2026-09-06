<script setup>
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

const { toggleTheme, isDark } = useTheme()
const authStore = useAuthStore()
const { getMe } = useAuth()

const notificationsCount = ref(4)
const showNotifications = ref(false)

const userName = computed(() => {
  return authStore.user?.name || 'Aluno'
})

const userInitials = computed(() => {
  const name = userName.value.trim()
  if (!name || name === 'Aluno') return 'A'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
})

onMounted(() => {
  if (!authStore.user) {
    getMe().catch(() => null)
  }
})
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-[var(--student-border)] bg-[var(--student-card)]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8"
  >
    <!-- LOGO (SEM O BOTÃO DE 3 BARRAS) -->
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/aluno"
        class="flex items-center gap-3"
      >
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-[var(--student-surface-secondary)] border border-[var(--student-border)] shadow-md transition hover:scale-105"
        >
          <img
            src="/images/logo conta.png"
            alt="Logo Conectar ENEM"
            class="h-full w-full object-contain"
          />
        </div>

        <div class="hidden sm:block">
          <h1 class="text-base font-black tracking-tight text-[var(--student-text)] leading-tight">
            Conectar ENEM
          </h1>
          <p class="text-xs font-medium text-[var(--student-text-muted)]">
            Área do aluno
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- ACTIONS (DIREITA) -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- NOTIFICAÇÕES COM BADGE -->
      <div class="relative">
        <button
          type="button"
          aria-label="Notificações"
          class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--student-border)] text-[var(--student-text-secondary)] transition hover:bg-[var(--student-primary-soft)] hover:text-[var(--student-primary-text)]"
          @click="showNotifications = !showNotifications"
        >
          <span class="material-symbols-rounded text-xl">
            notifications
          </span>

          <span
            v-if="notificationsCount > 0"
            class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white shadow-xs animate-pulse"
          >
            {{ notificationsCount }}
          </span>
        </button>

        <!-- DROPDOWN DE NOTIFICAÇÕES -->
        <div
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-72 rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-4 shadow-xl z-50"
        >
          <div class="flex items-center justify-between border-b border-[var(--student-border)] pb-2 mb-3">
            <h4 class="text-xs font-black text-[var(--student-text)] uppercase tracking-wider">
              Notificações
            </h4>
            <button
              type="button"
              class="text-[11px] font-bold text-purple-600 hover:underline"
              @click="notificationsCount = 0; showNotifications = false"
            >
              Marcar como lidas
            </button>
          </div>

          <div class="space-y-2.5 text-xs text-[var(--student-text-secondary)]">
            <div class="rounded-xl bg-[var(--student-surface)] p-2.5 border border-[var(--student-border)]">
              <p class="font-bold text-[var(--student-text)]">💡 Nova lista de questões</p>
              <p class="text-[11px] mt-0.5">Novas questões do ENEM 2024 adicionadas para treino.</p>
            </div>
            <div class="rounded-xl bg-[var(--student-surface)] p-2.5 border border-[var(--student-border)]">
              <p class="font-bold text-[var(--student-text)]">✍️ Tema de redação da semana</p>
              <p class="text-[11px] mt-0.5">Envie sua proposta e receba nota por competência.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- THEME SWITCHER -->
      <button
        type="button"
        :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--student-border)] text-[var(--student-text-secondary)] transition hover:bg-[var(--student-primary-soft)] hover:text-[var(--student-primary-text)]"
        @click="toggleTheme"
      >
        <span class="material-symbols-rounded text-xl">
          {{ isDark ? "light_mode" : "dark_mode" }}
        </span>
      </button>

      <!-- AVATAR DO USUÁRIO -->
      <NuxtLink
        to="/aluno/perfil"
        aria-label="Meu Perfil"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white font-black text-xs transition ring-2 ring-purple-600/30 hover:ring-purple-600 hover:scale-105 shadow-sm"
      >
        {{ userInitials }}
      </NuxtLink>
    </div>
  </header>
</template>
