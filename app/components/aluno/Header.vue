<script setup>
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

const { toggleTheme, isDark } = useTheme()
const authStore = useAuthStore()
const { getMe } = useAuth()

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
    <!-- LOGO (EXIBIDO APENAS EM MOBILE QUANDO A SIDEBAR ESTÁ OCULTA) -->
    <div class="flex items-center gap-3 lg:hidden">
      <NuxtLink
        to="/aluno"
        class="flex items-center gap-3"
      >
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-[var(--student-surface-secondary)] border border-[var(--student-border)] shadow-xs"
        >
          <img
            src="/images/icone mobile.png"
            alt="Logo Conectar ENEM"
            class="h-full w-full object-contain"
          />
        </div>

        <div>
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
    <div class="ml-auto flex items-center gap-2 sm:gap-3">

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
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white font-black text-xs shadow-sm"
      >
        {{ userInitials }}
      </div>
    </div>
  </header>
</template>
