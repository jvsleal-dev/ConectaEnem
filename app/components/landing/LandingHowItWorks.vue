<script setup>
const steps = [
  { number: '01', title: 'Crie sua conta', description: 'Cadastre-se gratuitamente e entre na plataforma.' },
  { number: '02', title: 'Monte seu caminho', description: 'Escolha matérias, aulas e materiais para estudar.' },
  { number: '03', title: 'Pratique de verdade', description: 'Resolva questões, simulados e redações.' },
  { number: '04', title: 'Veja sua evolução', description: 'Entenda seus resultados e saiba o que revisar.' }
]
</script>

<template>
  <section id="como-funciona" class="landing-soft-section py-24 sm:py-28 transition-colors duration-200">
    <div class="mx-auto max-w-7xl px-5 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span class="landing-eyebrow">Simples para começar</span>
        <h2 class="mt-4 text-3xl font-black tracking-[-.035em] text-zinc-950 sm:text-4xl dark:text-white">
          Seu próximo passo começa aqui
        </h2>
      </div>
      <div class="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div class="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent lg:block dark:via-violet-700" />
        <article
          v-for="step in steps"
          :key="step.number"
          class="relative rounded-3xl border border-white bg-white p-6 shadow-[0_12px_35px_rgba(76,29,149,.06)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40"
        >
          <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-lg font-black text-white shadow-lg shadow-violet-500/25">
            {{ step.number }}
          </span>
          <h3 class="mt-6 text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
            {{ step.title }}
          </h3>
          <p class="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
            {{ step.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
