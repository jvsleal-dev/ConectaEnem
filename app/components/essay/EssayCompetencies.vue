<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      c1Score: 160,
      c2Score: 160,
      c3Score: 160,
      c4Score: 160,
      c5Score: 160,
      justification1: '',
      justification2: '',
      justification3: '',
      justification4: '',
      justification5: '',
      positivePoints: '',
      improvements: '',
      generalComment: ''
    })
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const scoreOptions = [0, 40, 80, 120, 160, 200]

const competencies = [
  {
    id: 'c1',
    scoreKey: 'c1Score',
    justKey: 'justification1',
    title: 'Competência 1',
    name: 'Norma Padrão da Língua Escrita',
    desc: 'Demonstrar domínio da modalidade escrita formal da língua portuguesa.',
    rubric: {
      0: 'Desconhecimento total da norma padrão.',
      40: 'Domínio precário, com desvios gramaticais graves e frequentes.',
      80: 'Domínio insuficiente, com muitos desvios de pontuação e concordância.',
      120: 'Domínio mediano, com alguns desvios gramaticais e de convenção da escrita.',
      160: 'Bom domínio da norma culta, com poucos e ocasionais desvios.',
      200: 'Excelente domínio da norma padrão. Desvios raros e sem reincidência.'
    }
  },
  {
    id: 'c2',
    scoreKey: 'c2Score',
    justKey: 'justification2',
    title: 'Competência 2',
    name: 'Compreensão do Tema e Repertório',
    desc: 'Compreender a proposta de redação e aplicar conceitos das várias áreas do conhecimento.',
    rubric: {
      0: 'Fuga total ao tema ou não atendimento à estrutura dissertativo-argumentativa.',
      40: 'Tangenciamento do tema ou traços de outros tipos textuais.',
      80: 'Cópia dos textos motivadores ou repertório baseado apenas no senso comum.',
      120: 'Uso de repertório legitimado, porém pouco articulado ou sem autoria evidente.',
      160: 'Repertório legitimado, pertinente e produtivo ao longo do texto.',
      200: 'Repertório sociocultural produtivo, consistente e autoria autêntica.'
    }
  },
  {
    id: 'c3',
    scoreKey: 'c3Score',
    justKey: 'justification3',
    title: 'Competência 3',
    name: 'Projeto de Texto & Argumentação',
    desc: 'Selecionar, relacionar, organizar e interpretar informações e argumentos em defesa de um ponto de vista.',
    rubric: {
      0: 'Informações, fatos e opiniões desconexos e sem ponto de vista.',
      40: 'Apresenta informações desarticuladas e projeto de texto quase inexistente.',
      80: 'Projeto de texto com falhas visíveis e argumentação superficial.',
      120: 'Projeto de texto regular, com argumentos pertinentes mas previsíveis.',
      160: 'Projeto de texto estratégico, com argumentação consistente.',
      200: 'Projeto de texto estratégico impecável, autoria madura e defesa consistente.'
    }
  },
  {
    id: 'c4',
    scoreKey: 'c4Score',
    justKey: 'justification4',
    title: 'Competência 4',
    name: 'Coesão & Conectivos Interparágrafos',
    desc: 'Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.',
    rubric: {
      0: 'Ausência total de coesão ou frases truncadas.',
      40: 'Uso precário de conectivos e repetição excessiva de palavras.',
      80: 'Coesão insuficiente, com inadequações e conectivos monótonos.',
      120: 'Uso mediano de recursos coesivos, com algumas repetições.',
      160: 'Uso diversificado de operadores argumentativos inter e intraparágrafos.',
      200: 'Expressiva variedade de recursos coesivos, sem inadequações.'
    }
  },
  {
    id: 'c5',
    scoreKey: 'c5Score',
    justKey: 'justification5',
    title: 'Competência 5',
    name: 'Proposta de Intervenção Social',
    desc: 'Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.',
    rubric: {
      0: 'Ausência de proposta ou desrespeito frontal aos direitos humanos.',
      40: 'Apresenta apenas 1 dos 5 elementos válidos (agente, ação, meio, efeito, detalhamento).',
      80: 'Apresenta 2 elementos válidos articulados.',
      120: 'Apresenta 3 elementos válidos ou proposta vaga.',
      160: 'Apresenta 4 elementos válidos e articulados.',
      200: 'Proposta completa com os 5 elementos bem detalhados e exequíveis.'
    }
  }
]

const totalScore = computed(() => {
  const c1 = Number(props.modelValue.c1Score || 0)
  const c2 = Number(props.modelValue.c2Score || 0)
  const c3 = Number(props.modelValue.c3Score || 0)
  const c4 = Number(props.modelValue.c4Score || 0)
  const c5 = Number(props.modelValue.c5Score || 0)
  return c1 + c2 + c3 + c4 + c5
})

function setScore(key, score) {
  if (props.readOnly) return
  const updated = {
    ...props.modelValue,
    [key]: score
  }
  emit('update:modelValue', updated)
  emit('change', updated)
}

function updateField(key, val) {
  if (props.readOnly) return
  const updated = {
    ...props.modelValue,
    [key]: val
  }
  emit('update:modelValue', updated)
  emit('change', updated)
}
</script>

<template>
  <div class="space-y-6">
    <!-- BANNER NOTA TOTAL ENEM -->
    <div class="rounded-3xl bg-linear-to-r from-purple-700 via-purple-600 to-indigo-700 p-6 text-white shadow-xl shadow-purple-900/15 flex items-center justify-between">
      <div class="space-y-1">
        <span class="text-xs font-bold text-purple-200 uppercase tracking-wider block">Nota Oficial ENEM</span>
        <h3 class="text-xl sm:text-2xl font-black text-white">Matriz de Competências</h3>
        <p class="text-xs text-purple-100">5 Critérios de 200 pontos cada</p>
      </div>

      <div class="text-right">
        <span class="text-4xl sm:text-5xl font-black text-white tracking-tight">
          {{ totalScore }}
        </span>
        <span class="text-xs font-bold text-purple-200 block">/ 1000 pts</span>
      </div>
    </div>

    <!-- COMPETÊNCIAS C1 a C5 -->
    <div class="space-y-4">
      <div
        v-for="comp in competencies"
        :key="comp.id"
        class="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3.5 shadow-xs transition hover:border-slate-300 dark:hover:border-zinc-700"
      >
        <!-- Topo da Competência -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-lg border border-purple-100 dark:border-purple-800/60">
                {{ comp.title }}
              </span>
              <h4 class="text-sm font-black text-slate-900 dark:text-zinc-100">{{ comp.name }}</h4>
            </div>
            <p class="text-xs text-slate-500 dark:text-zinc-400 mt-1">{{ comp.desc }}</p>
          </div>

          <div class="shrink-0 text-right">
            <span class="text-base font-black text-purple-700 dark:text-purple-300 bg-purple-50/80 dark:bg-purple-950/40 px-3 py-1 rounded-xl border border-purple-200 dark:border-purple-800/60 inline-block">
              {{ modelValue[comp.scoreKey] || 0 }} pts
            </span>
          </div>
        </div>

        <!-- Seletor de Notas em Pílulas ENEM [0, 40, 80, 120, 160, 200] -->
        <div v-if="!readOnly" class="space-y-1.5">
          <div class="grid grid-cols-6 gap-1.5 pt-1">
            <button
              v-for="score in scoreOptions"
              :key="score"
              type="button"
              @click="setScore(comp.scoreKey, score)"
              class="py-2 rounded-xl text-xs font-black transition cursor-pointer text-center"
              :class="[
                modelValue[comp.scoreKey] === score
                  ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-600/30'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
              ]"
            >
              {{ score }}
            </button>
          </div>

          <!-- Descrição do Nível Escolhido da Matriz -->
          <p v-if="comp.rubric[modelValue[comp.scoreKey]]" class="text-[11px] text-purple-700 dark:text-purple-300 bg-purple-50/60 dark:bg-purple-950/30 p-2 rounded-xl border border-purple-100 dark:border-purple-800/40 italic">
            <strong>Nível {{ modelValue[comp.scoreKey] }} pts:</strong> {{ comp.rubric[modelValue[comp.scoreKey]] }}
          </p>
        </div>

        <!-- Justificativa do Professor para a Competência -->
        <div class="space-y-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Justificativa Pedagógica
          </label>
          <textarea
            v-if="!readOnly"
            :value="modelValue[comp.justKey]"
            @input="updateField(comp.justKey, $event.target.value)"
            rows="2"
            :placeholder="`Explique os critérios que levaram à nota da ${comp.title}...`"
            class="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/50 p-3 text-xs text-slate-800 dark:text-zinc-100 outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-purple-600/20 transition resize-none"
          ></textarea>
          <div v-else class="text-xs text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-slate-200 dark:border-zinc-700 italic">
            {{ modelValue[comp.justKey] || 'Nenhuma observação específica registrada.' }}
          </div>
        </div>
      </div>
    </div>

    <!-- SEÇÕES DE FEEDBACK GLOBAL -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Pontos Fortes -->
      <div class="rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 space-y-2">
        <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
          <span class="material-symbols-rounded text-lg text-emerald-600 dark:text-emerald-400">thumb_up</span>
          <span>Pontos Positivos & Acertos</span>
        </div>
        <textarea
          v-if="!readOnly"
          :value="modelValue.positivePoints"
          @input="updateField('positivePoints', $event.target.value)"
          rows="3"
          placeholder="O que o aluno fez de excelente neste texto..."
          class="w-full rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-900 p-3 text-xs text-slate-800 dark:text-zinc-100 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 transition"
        ></textarea>
        <p v-else class="text-xs text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">
          {{ modelValue.positivePoints || '—' }}
        </p>
      </div>

      <!-- O Que Melhorar -->
      <div class="rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 p-5 space-y-2">
        <div class="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
          <span class="material-symbols-rounded text-lg text-amber-600 dark:text-amber-400">trending_up</span>
          <span>Aspectos a Desenvolver</span>
        </div>
        <textarea
          v-if="!readOnly"
          :value="modelValue.improvements"
          @input="updateField('improvements', $event.target.value)"
          rows="3"
          placeholder="Pontos essenciais para focar nas próximas redações..."
          class="w-full rounded-2xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-zinc-900 p-3 text-xs text-slate-800 dark:text-zinc-100 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/20 transition"
        ></textarea>
        <p v-else class="text-xs text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">
          {{ modelValue.improvements || '—' }}
        </p>
      </div>
    </div>

    <!-- Comentário Geral Final -->
    <div class="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-2">
      <div class="flex items-center gap-2 text-slate-800 dark:text-zinc-200 font-bold text-xs">
        <span class="material-symbols-rounded text-lg text-purple-600 dark:text-purple-400">forum</span>
        <span>Parecer Geral & Orientação Final</span>
      </div>
      <textarea
        v-if="!readOnly"
        :value="modelValue.generalComment"
        @input="updateField('generalComment', $event.target.value)"
        rows="4"
        placeholder="Escreva uma mensagem de encorajamento e resumo da avaliação para o estudante..."
        class="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/50 p-3.5 text-xs text-slate-800 dark:text-zinc-100 outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-purple-600/20 transition"
      ></textarea>
      <p v-else class="text-xs text-slate-700 dark:text-zinc-300 whitespace-pre-wrap bg-slate-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-slate-200 dark:border-zinc-700">
        {{ modelValue.generalComment || 'Nenhum parecer geral cadastrado.' }}
      </p>
    </div>
  </div>
</template>
