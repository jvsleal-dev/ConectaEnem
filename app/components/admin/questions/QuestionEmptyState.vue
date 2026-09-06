<!-- app/components/admin/questions/QuestionEmptyState.vue -->
<script setup>
defineProps({
  filtered: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'clear',
  'create'
])
</script>

<template>
  <div class="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
    <div
      class="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--admin-primary-soft,#f3e8ff)] text-[var(--admin-primary,#6d28d9)]"
    >
      <span class="material-symbols-rounded text-[32px]">
        quiz
      </span>
    </div>

    <h3 class="text-lg font-bold">
      {{ filtered ? 'Nenhuma questão encontrada' : 'Nenhuma questão cadastrada' }}
    </h3>

    <p class="mt-2 max-w-md text-sm leading-6 text-[var(--admin-text-muted,#77727f)]">
      {{
        filtered
          ? 'Tente alterar os filtros ou limpar a busca para visualizar outras questões.'
          : 'Comece cadastrando a primeira questão do banco.'
      }}
    </p>

    <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <button
        v-if="filtered"
        type="button"
        class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--admin-border,#e9e7ee)] px-4 text-sm font-semibold transition hover:border-[var(--admin-primary,#6d28d9)] hover:text-[var(--admin-primary,#6d28d9)]"
        @click="emit('clear')"
      >
        <span class="material-symbols-rounded text-[19px]">
          filter_alt_off
        </span>

        Limpar filtros
      </button>

      <button
        type="button"
        class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--admin-primary,#6d28d9)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--admin-primary-hover,#5b21b6)]"
        @click="emit('create')"
      >
        <span class="material-symbols-rounded text-[19px]">
          add
        </span>

        Nova questão
      </button>
    </div>
  </div>
</template>