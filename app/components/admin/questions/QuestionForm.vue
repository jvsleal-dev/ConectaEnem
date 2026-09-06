<script setup>
import { useQuestions } from '~/composables/useQuestions'

const props = defineProps({
  question: {
    type: Object,
    default: null
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'success',
  'cancel'
])

const { createQuestion, updateQuestion } = useQuestions()

const subjects = ref([])
const loadingSubjects = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const defaultOptions = () => [
  { letter: 'A', text: '' },
  { letter: 'B', text: '' },
  { letter: 'C', text: '' },
  { letter: 'D', text: '' },
  { letter: 'E', text: '' }
]

const form = reactive({
  subjectId: '',
  title: '',
  statement: '',
  explanation: '',
  imageUrl: '',
  year: new Date().getFullYear(),
  difficulty: 'MEDIUM',
  correctAnswer: 'A',
  active: true,
  options: defaultOptions()
})

const previewImage = computed(() => {
  return form.imageUrl ? form.imageUrl.trim() : null
})

function setCorrect(letter) {
  form.correctAnswer = letter
}

async function loadSubjects() {
  loadingSubjects.value = true
  try {
    const response = await $fetch('/api/subjects/active').catch(() => null)
    if (response?.subjects) {
      subjects.value = response.subjects
    } else {
      const fallback = await $fetch('/api/subjects').catch(() => null)
      subjects.value = fallback?.subjects || []
    }
  } catch (err) {
    console.error('Erro ao carregar matérias:', err)
  } finally {
    loadingSubjects.value = false
  }
}

function prepareEdit() {
  if (!props.question) return

  form.subjectId = props.question.subjectId || props.question.subject?.id || ''
  form.title = props.question.title || ''
  form.statement = props.question.statement || ''
  form.explanation = props.question.explanation || ''
  form.imageUrl = props.question.imageUrl || ''
  form.year = props.question.year || null
  form.difficulty = props.question.difficulty || 'MEDIUM'
  form.correctAnswer = props.question.correctAnswer || 'A'
  form.active = props.question.active !== undefined ? Boolean(props.question.active) : true

  // Fill options
  const incomingOptions = props.question.options || props.question.alternatives || []
  const mappedOptions = defaultOptions().map(def => {
    const found = incomingOptions.find(o => String(o.letter).toUpperCase() === def.letter)
    return {
      letter: def.letter,
      text: found ? (found.text || found.content || '') : ''
    }
  })
  form.options = mappedOptions
}

watch(
  () => props.question,
  () => {
    prepareEdit()
  },
  { immediate: true, deep: true }
)

async function submit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.subjectId) {
    errorMessage.value = 'Por favor, selecione uma matéria para a questão.'
    return
  }

  if (!form.statement || !form.statement.trim()) {
    errorMessage.value = 'O enunciado da questão é obrigatório.'
    return
  }

  // Ensure at least 2 options are filled
  const filledOptions = form.options.filter(o => o.text && o.text.trim())
  if (filledOptions.length < 2) {
    errorMessage.value = 'Preencha pelo menos duas alternativas para a questão.'
    return
  }

  submitting.value = true

  const payload = {
    subjectId: form.subjectId,
    title: form.title?.trim() || null,
    statement: form.statement.trim(),
    explanation: form.explanation?.trim() || null,
    imageUrl: form.imageUrl?.trim() || null,
    difficulty: form.difficulty,
    year: form.year ? Number(form.year) : null,
    correctAnswer: form.correctAnswer,
    active: form.active,
    options: form.options.map(o => ({
      letter: o.letter,
      text: o.text?.trim() || ''
    }))
  }

  try {
    let result
    if (props.edit && props.question?.id) {
      result = await updateQuestion(props.question.id, payload)
      successMessage.value = 'Questão atualizada com sucesso!'
    } else {
      result = await createQuestion(payload)
      successMessage.value = 'Questão cadastrada com sucesso!'
    }

    emit('success', result)
  } catch (err) {
    console.error('Erro ao salvar questão:', err)
    errorMessage.value = err?.data?.statusMessage || err?.message || 'Erro ao salvar a questão. Tente novamente.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadSubjects()
  prepareEdit()
})
</script>

<template>
  <form
    class="space-y-8 rounded-3xl border border-[var(--admin-border,#e9e7ee)] bg-[var(--admin-card,#ffffff)] p-6 shadow-sm sm:p-8"
    @submit.prevent="submit"
  >
    <!-- CABEÇALHO DO FORMULÁRIO -->
    <div class="flex flex-col gap-2 border-b border-zinc-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-black text-zinc-900">
          {{ edit ? "Editar questão" : "Nova questão" }}
        </h2>
        <p class="mt-1 text-sm text-zinc-500">
          {{ edit ? "Atualize os dados e alternativas da questão no banco ENEM." : "Cadastre uma nova questão completa com alternativas e gabarito." }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          @click="emit('cancel')"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- ALERTA DE ERRO -->
    <div
      v-if="errorMessage"
      class="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
    >
      <span class="material-symbols-rounded text-xl shrink-0">error</span>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- ALERTA DE SUCESSO -->
    <div
      v-if="successMessage"
      class="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
    >
      <span class="material-symbols-rounded text-xl shrink-0">check_circle</span>
      <span>{{ successMessage }}</span>
    </div>

    <!-- METADADOS PRINCIPAIS -->
    <div class="grid gap-5 md:grid-cols-3">
      <!-- MATÉRIA -->
      <div>
        <label class="form-label required">
          Matéria
        </label>
        <select
          v-model="form.subjectId"
          class="form-input"
          required
        >
          <option value="" disabled>
            {{ loadingSubjects ? "Carregando matérias..." : "Selecione a matéria" }}
          </option>
          <option
            v-for="subject in subjects"
            :key="subject.id"
            :value="subject.id"
          >
            {{ subject.name || subject.title }}
          </option>
        </select>
      </div>

      <!-- ANO -->
      <div>
        <label class="form-label">
          Ano da Prova
        </label>
        <input
          v-model="form.year"
          type="number"
          min="1998"
          max="2030"
          class="form-input"
          placeholder="Ex: 2024"
        />
      </div>

      <!-- DIFICULDADE -->
      <div>
        <label class="form-label required">
          Dificuldade
        </label>
        <select
          v-model="form.difficulty"
          class="form-input"
        >
          <option value="EASY">Fácil</option>
          <option value="MEDIUM">Média</option>
          <option value="HARD">Difícil</option>
        </select>
      </div>
    </div>

    <!-- TÍTULO / IDENTIFICADOR -->
    <div>
      <label class="form-label">
        Título ou Subtítulo (Opcional)
      </label>
      <input
        v-model="form.title"
        class="form-input"
        placeholder="Ex: Questão 135 — Caderno Azul / Função Afim"
      />
    </div>

    <!-- ENUNCIADO -->
    <div>
      <label class="form-label required">
        Enunciado da Questão
      </label>
      <textarea
        v-model="form.statement"
        rows="7"
        class="form-input resize-y"
        placeholder="Digite ou cole aqui o texto completo do enunciado da questão..."
        required
      ></textarea>
    </div>

    <!-- IMAGEM DA QUESTÃO -->
    <div>
      <label class="form-label">
        URL da Imagem Ilustrativa (Opcional)
      </label>
      <div class="flex gap-2">
        <input
          v-model="form.imageUrl"
          type="url"
          class="form-input flex-1"
          placeholder="https://exemplo.com/imagem-questao.png"
        />
      </div>

      <!-- PREVIEW DA IMAGEM -->
      <div
        v-if="previewImage"
        class="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
      >
        <p class="mb-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          Pré-visualização da imagem
        </p>
        <img
          :src="previewImage"
          alt="Pré-visualização da questão"
          class="max-h-80 mx-auto rounded-xl object-contain shadow-xs"
          @error="errorMessage = 'Não foi possível carregar a imagem da URL fornecida.'"
        />
      </div>
    </div>

    <!-- ALTERNATIVAS -->
    <div>
      <div class="mb-3 flex items-center justify-between">
        <div>
          <label class="form-label required mb-0">
            Alternativas e Gabarito
          </label>
          <p class="text-xs text-zinc-500">
            Clique na letra da alternativa para definir qual é a <strong>resposta correta (Gabarito)</strong>.
          </p>
        </div>

        <div class="flex items-center gap-2 text-xs font-bold text-emerald-700">
          <span>Gabarito selecionado:</span>
          <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white">
            {{ form.correctAnswer }}
          </span>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="option in form.options"
          :key="option.letter"
          class="flex items-start gap-3 rounded-2xl border p-3 transition"
          :class="
            form.correctAnswer === option.letter
              ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
              : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50'
          "
        >
          <!-- BOTÃO GABARITO -->
          <button
            type="button"
            :title="`Definir alternativa ${option.letter} como resposta correta`"
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black text-sm transition shadow-xs"
            :class="
              form.correctAnswer === option.letter
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:border-emerald-500 hover:text-emerald-700'
            "
            @click="setCorrect(option.letter)"
          >
            {{ option.letter }}
          </button>

          <!-- TEXTO DA ALTERNATIVA -->
          <div class="flex-1">
            <textarea
              v-model="option.text"
              rows="2"
              class="form-input resize-y py-2.5 text-sm"
              :placeholder="`Texto da Alternativa ${option.letter}...`"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- RESOLUÇÃO / EXPLICAÇÃO -->
    <div>
      <label class="form-label">
        Resolução Comentada / Explicação (Opcional)
      </label>
      <textarea
        v-model="form.explanation"
        rows="4"
        class="form-input resize-y"
        placeholder="Explique o passo a passo da resolução para ajudar os alunos nos estudos..."
      ></textarea>
    </div>

    <!-- STATUS ATIVO -->
    <div class="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <input
        id="active-question"
        v-model="form.active"
        type="checkbox"
        class="h-5 w-5 rounded-md border-zinc-300 text-purple-600 focus:ring-purple-500"
      />
      <label
        for="active-question"
        class="text-sm font-semibold text-zinc-900 cursor-pointer mb-0!"
      >
        Questão Ativa (visível para os alunos realizarem simulados e listas de treino)
      </label>
    </div>

    <!-- BOTÕES DE AÇÃO -->
    <div class="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
      <button
        type="button"
        class="rounded-2xl border border-zinc-200 px-6 py-3.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
        @click="emit('cancel')"
      >
        Cancelar
      </button>

      <button
        type="submit"
        :disabled="submitting"
        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-purple-700 shadow-md shadow-purple-600/20 disabled:opacity-50"
      >
        <span
          v-if="submitting"
          class="material-symbols-rounded animate-spin text-lg"
        >
          progress_activity
        </span>
        <span>
          {{ submitting ? "Salvando questão..." : (edit ? "Atualizar questão" : "Salvar questão") }}
        </span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #27272a;
}

.form-label.required::after {
  content: " *";
  color: #dc2626;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  color: #18181b;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.12);
}
</style>