<script setup>
const props = defineProps({
  annotations: {
    type: Array,
    default: () => []
  },
  selectedAnnotationId: {
    type: String,
    default: null
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'select-annotation',
  'remove-annotation',
  'edit-annotation'
])

const categoryLabels = {
  GRAMMAR: { label: 'Gramática', color: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/60' },
  ARGUMENTATION: { label: 'Argumentação', color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60' },
  COHESION: { label: 'Coesão', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/60' },
  REPERTOIRE: { label: 'Repertório', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60' },
  STRUCTURE: { label: 'Estrutura', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/60' },
  PROPOSAL: { label: 'Proposta C5', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60' },
  VOCABULARY: { label: 'Vocabulário', color: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/60' },
  OTHER: { label: 'Outro', color: 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700' }
}

const comments = computed(() => {
  return props.annotations.filter((a) => {
    // Comentário marginal com texto
    if (a.type === 'COMMENT' && a.content) return true
    // Substituição escrita pelo professor
    if (a.type === 'STRIKE' && a.content) return true
    // Anotações textuais com categoria ou texto selecionado explicativo
    if (['UNDERLINE', 'STRIKE', 'HIGHLIGHT'].includes(a.type) && (a.content || a.category)) return true
    return false
  })
})
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 overflow-hidden select-none transition-colors duration-200">
    <!-- Header da Sidebar de Comentários -->
    <div class="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
      <div class="flex items-center gap-2">
        <span class="material-symbols-rounded text-purple-600 dark:text-purple-400 text-lg">fact_check</span>
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
          Correções & Comentários
        </h3>
      </div>
      <span class="text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/50 px-2 py-0.5 rounded-full">
        {{ comments.length }}
      </span>
    </div>

    <!-- Lista de Comentários e Correções -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2.5">
      <div v-if="comments.length === 0" class="py-12 text-center text-slate-400 dark:text-zinc-500">
        <span class="material-symbols-rounded text-3xl mb-1 text-slate-300 dark:text-zinc-600">chat_bubble_outline</span>
        <p class="text-xs font-bold text-slate-500 dark:text-zinc-400">Nenhuma anotação textual ainda.</p>
        <p class="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 max-w-[200px] mx-auto">
          {{ readOnly ? 'Esta redação não possui anotações marginais.' : 'Use a ferramenta "Riscar & Escrever" ou selecione um trecho para orientar o aluno.' }}
        </p>
      </div>

      <div
        v-for="item in comments"
        :key="item.id"
        @click="emit('select-annotation', item)"
        class="group rounded-2xl border p-3.5 transition duration-150 cursor-pointer text-left space-y-2"
        :class="[
          selectedAnnotationId === item.id
            ? 'border-purple-600 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 shadow-sm'
            : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-800'
        ]"
      >
        <!-- Topo do Card -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span
              v-if="item.type === 'STRIKE'"
              class="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 flex items-center gap-1"
            >
              <span>✍️ Substituição</span>
            </span>
            <span
              v-else-if="item.category && categoryLabels[item.category]"
              class="text-[10px] font-black uppercase px-2 py-0.5 rounded-md border"
              :class="categoryLabels[item.category].color"
            >
              {{ categoryLabels[item.category].label }}
            </span>
            <span v-else class="text-[10px] font-bold text-slate-400 dark:text-zinc-500">Observação</span>
          </div>

          <!-- Ação Excluir (apenas professor) -->
          <button
            v-if="!readOnly"
            type="button"
            title="Remover"
            @click.stop="emit('remove-annotation', item.id)"
            class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition h-6 w-6 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
          >
            <span class="material-symbols-rounded text-[16px]">delete</span>
          </button>
        </div>

        <!-- Trecho Selecionado / Riscado -->
        <div v-if="item.selectedText" class="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-700/60 p-2 text-[11px] text-slate-600 dark:text-zinc-300 italic font-serif line-clamp-2">
          <span class="line-through decoration-red-400 dark:decoration-red-500 text-slate-500 dark:text-zinc-400">"{{ item.selectedText }}"</span>
        </div>

        <!-- Conteúdo Escrito -->
        <p class="text-xs text-slate-800 dark:text-zinc-100 leading-relaxed font-sans font-medium whitespace-pre-wrap flex items-start gap-1">
          <span v-if="item.type === 'STRIKE'" class="text-purple-700 dark:text-purple-400 font-bold">➔</span>
          <span>{{ item.content }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
