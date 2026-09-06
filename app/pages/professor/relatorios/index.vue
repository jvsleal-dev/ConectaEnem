<script setup>
definePageMeta({
  layout: 'professor',
  middleware: 'teacher'
})

useSeoMeta({
  title: 'Relatórios — Painel do Professor | Conectar ENEM'
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Relatórios & Desempenho
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Visualize métricas detalhadas de evolução e engajamento dos seus alunos.
        </p>
      </div>
    </div>

    <!-- Placeholder inicial para Relatórios -->
    <div class="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-600 mb-4">
        <span class="material-symbols-rounded text-3xl">insights</span>
      </div>
      <h3 class="text-base font-black text-slate-900">Módulo de Relatórios</h3>
      <p class="mt-1 text-xs text-slate-500 max-w-md mx-auto">
        Gráficos de evolução das médias por competência do ENEM, taxa de entrega de redações e comparativos de desempenho por turma.
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/professor/dashboard"
          class="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2.5 text-xs font-black text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition"
        >
          <span class="material-symbols-rounded text-base">dashboard</span>
          <span>Voltar ao Dashboard</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
