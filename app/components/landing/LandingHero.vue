<script setup>
const mascoteSrc = '/images/mascote-conectar-enem.png.png'
</script>

<template>
  <section class="landing-hero relative isolate overflow-hidden">
    <div class="landing-orb landing-orb--one" />
    <div class="landing-orb landing-orb--two" />
    <div class="landing-grid absolute inset-0 -z-10 opacity-40" />

    <div class="mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-20">
      <div class="max-w-2xl">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/75 px-4 py-2 text-sm font-bold text-violet-700 shadow-sm backdrop-blur">
          <span class="h-2 w-2 rounded-full bg-emerald-500" />
          Preparação gratuita para o ENEM
        </div>

        <h1 class="text-4xl font-black leading-[1.06] tracking-[-0.045em] text-zinc-950 sm:text-5xl lg:text-[4.25rem]">
          O seu plano de estudos para chegar longe.
          <span class="block bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">No seu ritmo.</span>
        </h1>

        <p class="mt-6 max-w-xl text-lg leading-8 text-zinc-600 sm:text-xl">
          Aulas, questões, simulados e redação em uma plataforma feita para transformar sua preparação no ENEM.
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <NuxtLink to="/cadastro" class="landing-primary-button">
            Começar gratuitamente <span aria-hidden="true">→</span>
          </NuxtLink>
          <NuxtLink to="/login" class="landing-secondary-button">
            Já tenho uma conta
          </NuxtLink>
        </div>

        <div class="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-zinc-600">
          <span class="flex items-center gap-2"><b class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">✓</b> 100% gratuito</span>
          <span class="flex items-center gap-2"><b class="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-xs text-violet-700">✓</b> Sem assinatura</span>
          <span class="flex items-center gap-2"><b class="flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-100 text-xs text-fuchsia-700">✓</b> Feito para o ENEM</span>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:justify-self-end">
        <div class="hero-dashboard absolute inset-x-0 bottom-3 top-8 rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-2xl shadow-violet-950/10 backdrop-blur-md sm:p-6">
          <div class="flex items-center justify-between">
            <div><p class="text-xs font-bold uppercase tracking-[.16em] text-violet-500">Sua jornada</p><p class="mt-1 font-extrabold text-zinc-900">Preparação ENEM</p></div>
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg">✦</div>
          </div>
          <div class="mt-6 rounded-2xl bg-violet-50 p-4">
            <div class="flex items-center justify-between text-sm font-bold text-zinc-700"><span>Progresso da semana</span><span class="text-violet-700">72%</span></div>
            <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-violet-200"><div class="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" /></div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-zinc-100 bg-white p-3"><p class="text-2xl font-black text-zinc-900">24</p><p class="mt-1 text-xs font-medium text-zinc-500">questões feitas</p></div>
            <div class="rounded-2xl border border-zinc-100 bg-white p-3"><p class="text-2xl font-black text-zinc-900">4h20</p><p class="mt-1 text-xs font-medium text-zinc-500">de foco hoje</p></div>
          </div>
        </div>
        <div class="relative mx-auto flex min-h-[430px] items-end justify-center sm:min-h-[500px]">
          <div class="absolute bottom-8 h-64 w-64 rounded-full bg-fuchsia-300/40 blur-3xl" />
          <img :src="mascoteSrc" alt="Mascote do Conectar ENEM estudando" width="576" height="576" loading="eager" fetchpriority="high" class="relative z-10 w-[88%] max-w-[450px] object-contain drop-shadow-2xl" />
          <div class="absolute right-0 top-16 z-20 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-xl shadow-violet-950/10 backdrop-blur"><p class="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Meta de hoje</p><p class="mt-1 text-sm font-extrabold text-violet-700">+ 3 aulas</p></div>
        </div>
      </div>
    </div>
  </section>
</template>
