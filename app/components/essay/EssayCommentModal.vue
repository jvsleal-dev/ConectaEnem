<script setup>
const props = defineProps({
  show: Boolean,
  selectedText: String,
  initialCategory: {
    type: String,
    default: 'GRAMMAR'
  },
  initialContent: {
    type: String,
    default: ''
  },
  initialCorrectionText: {
    type: String,
    default: ''
  },
  isCorrectionMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const content = ref('')
const category = ref('GRAMMAR')
const correctionText = ref('') // Texto correto substituto escrito em cima

const categories = [
  { id: 'GRAMMAR', label: 'Gramática / Ortografia', icon: 'spellcheck' },
  { id: 'ARGUMENTATION', label: 'Argumentação & Lógica', icon: 'psychology' },
  { id: 'COHESION', label: 'Coesão / Conectivo', icon: 'link' },
  { id: 'REPERTOIRE', label: 'Repertório Sociocultural', icon: 'menu_book' },
  { id: 'STRUCTURE', label: 'Estrutura Sintática', icon: 'view_agenda' },
  { id: 'PROPOSAL', label: 'Proposta C5', icon: 'flag' },
  { id: 'VOCABULARY', label: 'Vocabulário / Precisão', icon: 'translate' },
  { id: 'OTHER', label: 'Outro Feedback', icon: 'more_horiz' }
]

watch(() => props.show, (newVal) => {
  if (newVal) {
    content.value = props.initialContent || ''
    category.value = props.initialCategory || 'GRAMMAR'
    correctionText.value = props.initialCorrectionText || ''
  }
})

function handleSave() {
  if (!content.value.trim() && !correctionText.value.trim()) return
  emit('save', {
    content: content.value.trim(),
    category: category.value,
    correctionText: correctionText.value.trim()
  })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" @click="emit('close')"></div>

        <div class="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-4 z-10 border border-slate-100 dark:border-zinc-800 transition-colors duration-200">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div class="flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <span class="material-symbols-rounded text-xl">{{ isCorrectionMode ? 'draw' : 'add_comment' }}</span>
              <h3 class="text-sm font-black text-slate-900 dark:text-zinc-100">
                {{ isCorrectionMode ? 'Riscar e Escrever Correção em Cima' : 'Novo Comentário Pedagógico' }}
              </h3>
            </div>
            <button
              type="button"
              @click="emit('close')"
              class="h-7 w-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <span class="material-symbols-rounded text-lg">close</span>
            </button>
          </div>

          <!-- Trecho Riscado do Aluno -->
          <div v-if="selectedText" class="rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 p-3 space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">Texto Original do Aluno</span>
            <p class="text-xs text-red-950 dark:text-red-200 font-serif line-through decoration-red-500 decoration-2 italic line-clamp-3">
              "{{ selectedText }}"
            </p>
          </div>

          <!-- Campo Principal: Escrita por Cima (Correção Direta Sugerida) -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-purple-900 dark:text-purple-300 flex items-center justify-between">
              <span>✍️ Escrever por Cima (Texto Correto Sugerido)</span>
              <span class="text-[10px] font-normal text-purple-600 dark:text-purple-400">Aparece flutuando em cima do risco</span>
            </label>
            <input
              v-model="correctionText"
              type="text"
              placeholder="Ex: portanto, haja vista, excessão ➔ exceção"
              class="w-full rounded-2xl border-2 border-purple-300 dark:border-purple-600/60 bg-purple-50/30 dark:bg-purple-950/20 px-3.5 py-2.5 text-xs text-slate-900 dark:text-zinc-100 font-bold outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-purple-600/20 transition"
              autofocus
            />
          </div>

          <!-- Categoria do Feedback -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300">Categoria do Erro</label>
            <div class="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
              <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                @click="category = cat.id"
                class="flex items-center gap-2 p-2 rounded-xl border text-xs font-bold text-left transition cursor-pointer"
                :class="category === cat.id ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 shadow-2xs' : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'"
              >
                <span class="material-symbols-rounded text-sm" :class="category === cat.id ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-zinc-500'">
                  {{ cat.icon }}
                </span>
                <span class="truncate">{{ cat.label }}</span>
              </button>
            </div>
          </div>

          <!-- Explicação Adicional / Orientação Opcional -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300">Explicação / Dica Adicional (Opcional)</label>
            <textarea
              v-model="content"
              rows="2"
              placeholder="Ex: Houve um desvio de concordância verbal com o sujeito composto..."
              class="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-xs text-slate-800 dark:text-zinc-100 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 transition resize-none"
            ></textarea>
          </div>

          <!-- Ações -->
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              :disabled="!content.trim() && !correctionText.trim()"
              @click="handleSave"
              class="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 text-xs font-black text-white hover:bg-purple-700 transition disabled:opacity-40 shadow-sm shadow-purple-600/20 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">check</span>
              <span>Inserir Correção</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
