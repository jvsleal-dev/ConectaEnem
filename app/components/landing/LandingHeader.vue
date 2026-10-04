<script setup>
const mobileMenuOpen = ref(false)

function closeMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-purple-100/80 bg-white/90 backdrop-blur-xl transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-950/85"
  >
    <div
      class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
        aria-label="Conectar ENEM"
      >
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-purple-100 dark:border-zinc-800 shadow-sm p-0.5 bg-white dark:bg-zinc-900"
        >
          <img src="/images/logo conta.png" alt="Logo Conectar ENEM" class="h-full w-full object-contain" />
        </div>

        <span
          class="text-lg font-extrabold tracking-tight text-[var(--color-primary-dark)] dark:text-purple-400"
        >
          Conectar ENEM
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-8 md:flex">
        <a
          href="#recursos"
          class="text-sm font-medium text-zinc-600 transition hover:text-[var(--color-primary)] dark:text-zinc-300 dark:hover:text-purple-400"
        >
          Recursos
        </a>

        <a
          href="#redacao"
          class="text-sm font-medium text-zinc-600 transition hover:text-[var(--color-primary)] dark:text-zinc-300 dark:hover:text-purple-400"
        >
          Redação
        </a>

        <a
          href="#como-funciona"
          class="text-sm font-medium text-zinc-600 transition hover:text-[var(--color-primary)] dark:text-zinc-300 dark:hover:text-purple-400"
        >
          Como funciona
        </a>

        <a
          href="#sobre"
          class="text-sm font-medium text-zinc-600 transition hover:text-[var(--color-primary)] dark:text-zinc-300 dark:hover:text-purple-400"
        >
          Sobre
        </a>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <NuxtLink
          to="/login"
          class="rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-950/40"
        >
          Entrar
        </NuxtLink>

        <NuxtLink
          to="/cadastro"
          class="rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)] dark:shadow-purple-950/50"
        >
          Criar conta
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2 md:hidden">
        <button
          type="button"
          class="rounded-lg p-2 text-xl text-zinc-700 dark:text-zinc-200"
          aria-label="Abrir menu"
          :aria-expanded="mobileMenuOpen"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          ☰
        </button>
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="border-t border-purple-100 bg-white px-5 py-5 transition-colors md:hidden dark:border-zinc-800 dark:bg-zinc-900"
    >
      <nav class="flex flex-col gap-4">
        <a
          href="#recursos"
          class="font-medium text-zinc-700 hover:text-purple-600 dark:text-zinc-200 dark:hover:text-purple-400"
          @click="closeMenu"
        >
          Recursos
        </a>

        <a
          href="#redacao"
          class="font-medium text-zinc-700 hover:text-purple-600 dark:text-zinc-200 dark:hover:text-purple-400"
          @click="closeMenu"
        >
          Redação
        </a>

        <a
          href="#como-funciona"
          class="font-medium text-zinc-700 hover:text-purple-600 dark:text-zinc-200 dark:hover:text-purple-400"
          @click="closeMenu"
        >
          Como funciona
        </a>

        <a
          href="#sobre"
          class="font-medium text-zinc-700 hover:text-purple-600 dark:text-zinc-200 dark:hover:text-purple-400"
          @click="closeMenu"
        >
          Sobre
        </a>

        <div class="my-1 border-t border-purple-100 dark:border-zinc-800" />

        <NuxtLink
          to="/login"
          class="font-semibold text-zinc-800 hover:text-purple-600 dark:text-zinc-200 dark:hover:text-purple-400"
          @click="closeMenu"
        >
          Entrar
        </NuxtLink>

        <NuxtLink
          to="/cadastro"
          class="rounded-xl bg-[var(--color-primary)] px-4 py-3 text-center font-semibold text-white shadow-md shadow-purple-600/20"
          @click="closeMenu"
        >
          Criar conta gratuita
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>