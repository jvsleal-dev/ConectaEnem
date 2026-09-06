<script setup>
const features = [
  { icon: '▶', title: 'Videoaulas', description: 'Conteúdos organizados por matérias, módulos e aulas em uma sequência clara.', tone: 'violet' },
  { icon: '✓', title: 'Questões', description: 'Pratique por assunto e dificuldade, acompanhando cada acerto.', tone: 'sky' },
  { icon: '◎', title: 'Simulados', description: 'Teste seus conhecimentos e entenda onde concentrar seus esforços.', tone: 'orange' },
  { icon: '◇', title: 'Flashcards', description: 'Revise o que importa e fortaleça sua memorização todos os dias.', tone: 'rose' },
  { icon: '✎', title: 'Redação', description: 'Treine com temas, textos motivadores e feedbacks detalhados.', tone: 'emerald' },
  { icon: '✦', title: 'Tutor IA', description: 'Tire dúvidas e receba explicações durante sua preparação.', tone: 'fuchsia' }
]
</script>

<template>
  <section id="recursos" class="relative bg-white py-24 sm:py-28">
    <div class="mx-auto max-w-7xl px-5 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span class="landing-eyebrow">Tudo em um só lugar</span>
        <h2 class="mt-4 text-3xl font-black tracking-[-.035em] text-zinc-950 sm:text-4xl">Ferramentas para estudar com mais direção</h2>
        <p class="mt-4 leading-7 text-zinc-600">Aprenda, pratique, revise e acompanhe sua evolução dentro da mesma plataforma.</p>
      </div>
      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="feature in features" :key="feature.title" class="landing-feature-card group">
          <div :class="`landing-feature-icon landing-feature-icon--${feature.tone}`">{{ feature.icon }}</div>
          <h3 class="mt-6 text-lg font-extrabold text-zinc-900">{{ feature.title }}</h3>
          <p class="mt-2 leading-7 text-zinc-600">{{ feature.description }}</p>
          <span class="mt-5 inline-flex items-center gap-1 text-sm font-bold text-violet-700 opacity-0 transition group-hover:opacity-100">Explorar <span aria-hidden="true">→</span></span>
        </article>
      </div>
    </div>
  </section>
</template>
