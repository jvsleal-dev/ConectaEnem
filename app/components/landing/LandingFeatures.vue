<script setup>
const features = [
  {
    icon: '▶',
    title: 'Videoaulas',
    description:
      'Conteúdos organizados por matérias, módulos e aulas em uma sequência clara de estudos.'
  },
  {
    icon: '✓',
    title: 'Questões',
    description:
      'Pratique por matéria, assunto e dificuldade e acompanhe seus erros e acertos.'
  },
  {
    icon: '◎',
    title: 'Simulados',
    description:
      'Faça simulados completos ou personalizados e acompanhe seu desempenho.'
  },
  {
    icon: '◆',
    title: 'Flashcards',
    description:
      'Revise os conteúdos mais importantes e fortaleça sua memorização.'
  },
  {
    icon: '✎',
    title: 'Redação',
    description:
      'Treine com temas, textos motivadores, IA e correção de professores.'
  },
  {
    icon: '✦',
    title: 'Tutor IA',
    description:
      'Pergunte, tire dúvidas e receba explicações durante sua preparação.'
  }
]
</script>

<template>
  <section
    id="recursos"
    class="bg-white py-24"
  >
    <div class="mx-auto max-w-7xl px-5 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span
          class="font-semibold text-[var(--color-primary)]"
        >
          Tudo em um só lugar
        </span>

        <h2
          class="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl"
        >
          Ferramentas para você chegar mais preparado ao ENEM
        </h2>

        <p class="mt-4 leading-7 text-zinc-600">
          Aprenda, pratique, revise e acompanhe sua evolução
          dentro da mesma plataforma.
        </p>
      </div>

      <div
        class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="feature in features"
          :key="feature.title"
          class="group rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5"
        >
          <div
            class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-lg font-black text-[var(--color-primary)] transition group-hover:bg-[var(--color-primary)] group-hover:text-white"
          >
            {{ feature.icon }}
          </div>

          <h3 class="text-lg font-bold text-zinc-900">
            {{ feature.title }}
          </h3>

          <p class="mt-2 leading-7 text-zinc-600">
            {{ feature.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>