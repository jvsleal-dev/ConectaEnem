<script setup>
const steps = [
  {
    number: '01',
    title: 'Crie sua conta',
    description:
      'Cadastre-se gratuitamente e tenha acesso à plataforma.'
  },
  {
    number: '02',
    title: 'Escolha o que estudar',
    description:
      'Acesse matérias, módulos, videoaulas e materiais.'
  },
  {
    number: '03',
    title: 'Pratique',
    description:
      'Resolva questões, flashcards, simulados e redações.'
  },
  {
    number: '04',
    title: 'Acompanhe sua evolução',
    description:
      'Veja seus resultados e descubra quais assuntos precisa revisar.'
  }
]
</script>

<template>
  <section
    id="como-funciona"
    class="bg-purple-50/50 py-24"
  >
    <div class="mx-auto max-w-7xl px-5 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span
          class="font-semibold text-[var(--color-primary)]"
        >
          Simples para começar
        </span>

        <h2
          class="mt-3 text-3xl font-black text-zinc-900 sm:text-4xl"
        >
          Como funciona
        </h2>
      </div>

      <div
        class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <article
          v-for="step in steps"
          :key="step.number"
          class="relative rounded-2xl bg-white p-6 shadow-sm"
        >
          <span
            class="text-sm font-black text-[var(--color-primary-light)]"
          >
            {{ step.number }}
          </span>

          <h3
            class="mt-4 text-lg font-bold text-zinc-900"
          >
            {{ step.title }}
          </h3>

          <p
            class="mt-2 leading-7 text-zinc-600"
          >
            {{ step.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>