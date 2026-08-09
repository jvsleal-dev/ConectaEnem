<script setup>
const mobileMenuOpen = ref(false)

function closeMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-purple-100/80 bg-white/90 backdrop-blur-xl"
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
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] font-bold text-white shadow-sm"
        >
          C
        </div>

        <span
          class="text-lg font-extrabold tracking-tight text-[var(--color-primary-dark)]"
        >
          Conectar ENEM
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-8 md:flex">
        <a
          href="#recursos"
          class="text-sm font-medium text-zinc-600 transition hover:text-[var(--color-primary)]"
        >
          Recursos
        </a>

        <a
          href="#redacao"
          class="text-sm font-medium text-zinc-600 transition hover:text-[var(--color-primary)]"
        >
          Redação
        </a>

        <a
          href="#como-funciona"
          class="text-sm font-medium text-zinc-600 transition hover:text-[var(--color-primary)]"
        >
          Como funciona
        </a>

        <a
          href="#sobre"
          class="text-sm font-medium text-zinc-600 transition hover:text-[var(--color-primary)]"
        >
          Sobre
        </a>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <NuxtLink
          to="/login"
          class="rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:bg-purple-50"
        >
          Entrar
        </NuxtLink>

        <NuxtLink
          to="/cadastro"
          class="rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)]"
        >
          Criar conta
        </NuxtLink>
      </div>

      <button
        type="button"
        class="rounded-lg p-2 text-xl text-zinc-700 md:hidden"
        aria-label="Abrir menu"
        :aria-expanded="mobileMenuOpen"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        ☰
      </button>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="border-t border-purple-100 bg-white px-5 py-5 md:hidden"
    >
      <nav class="flex flex-col gap-4">
        <a
          href="#recursos"
          @click="closeMenu"
        >
          Recursos
        </a>

        <a
          href="#redacao"
          @click="closeMenu"
        >
          Redação
        </a>

        <a
          href="#como-funciona"
          @click="closeMenu"
        >
          Como funciona
        </a>

        <a
          href="#sobre"
          @click="closeMenu"
        >
          Sobre
        </a>

        <div class="my-1 border-t border-purple-100" />

        <NuxtLink
          to="/login"
          @click="closeMenu"
        >
          Entrar
        </NuxtLink>

        <NuxtLink
          to="/cadastro"
          class="rounded-xl bg-[var(--color-primary)] px-4 py-3 text-center font-semibold text-white"
          @click="closeMenu"
        >
          Criar conta gratuita
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>