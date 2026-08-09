<script setup>
const mascoteSrc = '/images/mascote-conectar-enem.jpeg'
</script>

<template>
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 -z-20 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50"
    />

    <div
      class="absolute -right-40 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-[var(--color-primary-light)]/10 blur-3xl"
    />

    <div
      class="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8"
    >
      <div class="max-w-2xl">
        <div
          class="mb-6 inline-flex items-center rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] shadow-sm"
        >
          Preparação gratuita para o ENEM
        </div>

        <h1
          class="text-4xl font-black leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl"
        >
          Conecte seus estudos ao seu
          <span class="text-[var(--color-primary)]">
            futuro.
          </span>
        </h1>

        <p class="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
          Videoaulas, questões, simulados, flashcards, redação
          e inteligência artificial reunidos em uma plataforma
          gratuita para sua preparação para o ENEM.
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <NuxtLink
            to="/cadastro"
            class="rounded-xl bg-[var(--color-primary)] px-7 py-3.5 text-center font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]"
          >
            Começar gratuitamente
          </NuxtLink>

          <NuxtLink
            to="/login"
            class="rounded-xl border border-purple-200 bg-white px-7 py-3.5 text-center font-semibold text-zinc-700 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            Já tenho uma conta
          </NuxtLink>
        </div>

        <div
          class="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500"
        >
          <span>✓ Gratuito</span>
          <span>✓ Sem assinatura</span>
          <span>✓ Feito para o ENEM</span>
        </div>
      </div>

      <div
        class="relative flex items-center justify-center lg:justify-end"
      >
        <div
          class="absolute h-80 w-80 rounded-full bg-[var(--color-primary-light)]/20 blur-3xl"
        />

        <img
          :src="mascoteSrc"
          alt="Mascote do Conectar ENEM estudando"
          width="576"
          height="576"
          loading="eager"
          fetchpriority="high"
          class="relative z-10 w-full max-w-[480px] object-contain"
        >
      </div>
    </div>
  </section>
</template>