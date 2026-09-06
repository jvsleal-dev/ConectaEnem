<script setup>
const props = defineProps({
  show: Boolean,
  essay: Object,
  saving: Boolean
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  c1Score: 160,
  c2Score: 160,
  c3Score: 160,
  c4Score: 160,
  c5Score: 160,
  c1Comment: '',
  c2Comment: '',
  c3Comment: '',
  c4Comment: '',
  c5Comment: '',
  generalFeedback: ''
})

const scoreOptions = [0, 40, 80, 120, 160, 200]

const competencies = [
  { id: 'c1', key: 'c1Score', commentKey: 'c1Comment', title: 'Competência 1', desc: 'Domínio da norma padrão da língua escrita.' },
  { id: 'c2', key: 'c2Score', commentKey: 'c2Comment', title: 'Competência 2', desc: 'Compreensão do tema e aplicação das áreas do conhecimento.' },
  { id: 'c3', key: 'c3Score', commentKey: 'c3Comment', title: 'Competência 3', desc: 'Seleção, relação, organização e interpretação de informações/argumentos.' },
  { id: 'c4', key: 'c4Score', commentKey: 'c4Comment', title: 'Competência 4', desc: 'Conhecimento dos mecanismos linguísticos de argumentação.' },
  { id: 'c5', key: 'c5Score', commentKey: 'c5Comment', title: 'Competência 5', desc: 'Elaboração de proposta de intervenção social com 5 elementos.' }
]

watch(() => props.essay, (newEssay) => {
  if (newEssay?.correction) {
    form.c1Score = newEssay.correction.c1Score ?? 160
    form.c2Score = newEssay.correction.c2Score ?? 160
    form.c3Score = newEssay.correction.c3Score ?? 160
    form.c4Score = newEssay.correction.c4Score ?? 160
    form.c5Score = newEssay.correction.c5Score ?? 160
    form.c1Comment = newEssay.correction.c1Comment || ''
    form.c2Comment = newEssay.correction.c2Comment || ''
    form.c3Comment = newEssay.correction.c3Comment || ''
    form.c4Comment = newEssay.correction.c4Comment || ''
    form.c5Comment = newEssay.correction.c5Comment || ''
    form.generalFeedback = newEssay.correction.generalFeedback || ''
  } else {
    form.c1Score = 160
    form.c2Score = 160
    form.c3Score = 160
    form.c4Score = 160
    form.c5Score = 160
    form.c1Comment = ''
    form.c2Comment = ''
    form.c3Comment = ''
    form.c4Comment = ''
    form.c5Comment = ''
    form.generalFeedback = ''
  }
}, { immediate: true })

const totalScore = computed(() => {
  return Number(form.c1Score) + Number(form.c2Score) + Number(form.c3Score) + Number(form.c4Score) + Number(form.c5Score)
})

function handleSave() {
  emit('save', {
    ...form,
    totalScore: totalScore.value
  })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" @click="emit('close')"></div>

        <!-- Modal Box Max-Width Large -->
        <div class="relative w-full max-w-6xl max-h-[92vh] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden z-10">
          <!-- Top Header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50 shrink-0">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 font-bold">
                <span class="material-symbols-rounded text-xl">rate_review</span>
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900 leading-tight">Avaliação de Redação ENEM</h3>
                <p class="text-xs text-slate-500">
                  Aluno: <strong class="text-slate-700">{{ essay?.student?.name }}</strong> • Turma: {{ essay?.classroom?.name }}
                </p>
              </div>
            </div>

            <!-- Score Pill -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-1.5 text-white shadow-md shadow-purple-600/20">
                <span class="text-xs font-bold text-purple-200">Nota Total:</span>
                <span class="text-lg font-black">{{ totalScore }} / 1000</span>
              </div>

              <button
                type="button"
                class="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                @click="emit('close')"
              >
                <span class="material-symbols-rounded text-xl">close</span>
              </button>
            </div>
          </div>

          <!-- Body Content: 2 Columns (Texto do Aluno à esquerda, Critérios à direita) -->
          <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Coluna 1: Redação do Aluno -->
            <div class="space-y-4 flex flex-col">
              <div class="rounded-2xl bg-purple-50/60 border border-purple-100 p-4">
                <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700">Tema Proposto</span>
                <h4 class="text-sm font-black text-slate-900 mt-0.5">{{ essay?.theme }}</h4>
              </div>

              <div class="flex-1 rounded-2xl border border-slate-200 bg-slate-50/30 p-5 overflow-y-auto">
                <h5 v-if="essay?.title" class="text-center font-bold text-slate-800 mb-4 text-sm underline decoration-purple-300">
                  {{ essay.title }}
                </h5>
                <div class="prose prose-sm max-w-none text-slate-700 font-serif leading-relaxed whitespace-pre-wrap select-text text-sm">
                  {{ essay?.content }}
                </div>
              </div>
            </div>

            <!-- Coluna 2: Formulário de Correção por Competência (C1 a C5) -->
            <div class="space-y-4 overflow-y-auto pr-1">
              <div
                v-for="comp in competencies"
                :key="comp.id"
                class="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5 shadow-2xs"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h5 class="text-xs font-black text-slate-900">{{ comp.title }}</h5>
                    <p class="text-[11px] text-slate-400">{{ comp.desc }}</p>
                  </div>
                  <span class="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">
                    {{ form[comp.key] }} pts
                  </span>
                </div>

                <!-- Pontuação Rápida em Pílulas (0, 40, 80, 120, 160, 200) -->
                <div class="flex items-center gap-1.5 pt-1">
                  <button
                    v-for="score in scoreOptions"
                    :key="score"
                    type="button"
                    @click="form[comp.key] = score"
                    class="flex-1 py-1 rounded-xl text-xs font-bold transition text-center"
                    :class="form[comp.key] === score ? 'bg-purple-600 text-white font-black shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  >
                    {{ score }}
                  </button>
                </div>

                <!-- Comentário Específico -->
                <textarea
                  v-model="form[comp.commentKey]"
                  rows="1"
                  placeholder="Feedback específico para esta competência (opcional)..."
                  class="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-700 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 transition resize-none"
                ></textarea>
              </div>

              <!-- Comentário Geral / Orientações -->
              <div class="rounded-2xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-2xs">
                <label class="block text-xs font-black text-slate-900">
                  Parecer Geral & Dicas para o Aluno
                </label>
                <textarea
                  v-model="form.generalFeedback"
                  rows="3"
                  placeholder="Escreva orientações gerais, pontos fortes e o que melhorar no próximo texto..."
                  class="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 transition"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Footer Ações -->
          <div class="border-t border-slate-100 p-4 px-6 bg-slate-50/50 flex items-center justify-between shrink-0">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              @click="emit('close')"
            >
              Cancelar
            </button>

            <button
              type="button"
              :disabled="saving"
              @click="handleSave"
              class="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-purple-600 text-xs font-black text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition disabled:opacity-50 active:scale-98"
            >
              <span v-if="saving" class="material-symbols-rounded animate-spin text-sm">progress_activity</span>
              <span v-else class="material-symbols-rounded text-sm">check</span>
              <span>{{ saving ? 'Salvando Correção...' : 'Concluir & Publicar Correção' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
