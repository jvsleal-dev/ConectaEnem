<script setup>
import { useAuthStore } from '~/stores/auth'

defineProps({
  title: {
    type: String,
    default: 'Painel Administrativo'
  }
})

const emit = defineEmits([
  'open-sidebar'
])

const authStore = useAuthStore()

const adminName = computed(() => {
  return (
    authStore.user?.name ||
    'Administrador'
  )
})

const initials = computed(() => {
  const name = adminName.value.trim()

  if (!name) {
    return 'AD'
  }

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
})
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"
  >
    <div class="flex items-center gap-4">
      <!-- Mobile -->
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-xl text-zinc-600 transition hover:bg-zinc-50 lg:hidden"
        @click="emit('open-sidebar')"
      >
        ☰
      </button>

      <div>
        <h1
          class="text-lg font-black text-zinc-900 sm:text-xl"
        >
          {{ title }}
        </h1>

        <p
          class="hidden text-xs text-zinc-400 sm:block"
        >
          Gerencie o conteúdo do Conectar ENEM
        </p>
      </div>
    </div>

    <!-- Admin -->
    <div
      class="flex items-center gap-3"
    >
      <div
        class="hidden text-right sm:block"
      >
        <p
          class="max-w-[180px] truncate text-sm font-bold text-zinc-800"
        >
          {{ adminName }}
        </p>

        <p class="text-xs text-zinc-400">
          Administrador
        </p>
      </div>

      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-black text-[var(--color-primary)]"
      >
        {{ initials }}
      </div>
    </div>
  </header>
</template>