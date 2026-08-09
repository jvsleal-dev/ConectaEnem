<template>
  <section
    id="redacao"
    class="relative overflow-hidden bg-[var(--color-primary-dark)] py-24 text-white"
  >
    <div
      class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--color-primary-light)]/20 blur-3xl"
    />

    <div
      class="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8"
    >
      <div>
        <span class="font-semibold text-purple-200">
          Redação ENEM
        </span>

        <h2
          class="mt-3 text-3xl font-black tracking-tight sm:text-4xl"
        >
          Treine sua redação e acompanhe sua evolução.
        </h2>

        <p
          class="mt-5 max-w-xl text-lg leading-8 text-purple-100"
        >
          Escolha temas com textos motivadores, produza sua
          redação e receba análises que ajudam você a entender
          onde está evoluindo e o que ainda precisa melhorar.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <span
            class="rounded-full bg-white/10 px-4 py-2 text-sm"
          >
            Competências ENEM
          </span>

          <span
            class="rounded-full bg-white/10 px-4 py-2 text-sm"
          >
            Temas atualizados
          </span>

          <span
            class="rounded-full bg-white/10 px-4 py-2 text-sm"
          >
            Textos motivadores
          </span>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <article
          class="rounded-2xl border border-white/10 bg-white/10 p-7 backdrop-blur-sm"
        >
          <div
            class="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl"
          >
            ✦
          </div>

          <h3 class="text-lg font-bold">
            Corretor IA
          </h3>

          <p
            class="mt-3 text-sm leading-6 text-purple-100"
          >
            Receba uma análise estimada das cinco competências,
            pontos fortes e sugestões de melhoria.
          </p>
        </article>

        <article
          class="rounded-2xl border border-white/10 bg-white/10 p-7 backdrop-blur-sm"
        >
          <div
            class="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl"
          >
            ✎
          </div>

          <h3 class="text-lg font-bold">
            Professor de Redação
          </h3>

          <p
            class="mt-3 text-sm leading-6 text-purple-100"
          >
            Receba marcações, notas por competência, feedback
            escrito e comentários em áudio.
          </p>
        </article>
      </div>
    </div>
  </section>
</template>