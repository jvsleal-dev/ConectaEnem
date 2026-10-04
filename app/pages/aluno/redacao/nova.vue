<script setup>
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'aluno'
})

useSeoMeta({
  title: 'Nova Redação — Área do Aluno | Conectar ENEM'
})

const authStore = useAuthStore()

// Etapas do Fluxo:
// 'THEME_SELECTION' -> Dois botões: Tema livre / Escolher tema
// 'CUSTOM_THEME' -> Digitar tema livre
// 'CATALOG_THEME' -> Lista de propostas
// 'THEME_DETAIL' -> Ver proposta detalhada com textos motivadores I, II e III
// 'FORMAT_SELECTION' -> Dois botões: Escrever / Enviar foto
// 'EDITOR' -> Editor amplo (30 linhas padrão ENEM) com pautas e cronômetro
const currentStep = ref('THEME_SELECTION')

const customTheme = ref('')
const selectedThemeObj = ref(null)
const chosenTheme = ref('')

const submissionMode = ref('TEXT') // 'TEXT' ou 'PHOTO'
const essayTitle = ref('')
const essayText = ref('')
const photoPreview = ref(null)
const photoFile = ref(null)

const selectedClassroom = ref('')
const classrooms = ref([])

// Cronômetro (Timer)
const timerSeconds = ref(0)
const timerRunning = ref(false)
let timerInterval = null

// Ferramentas
const fontSize = ref(15) // em px

const loadingClassrooms = ref(true)
const showMotivatorModal = ref(false)
const showConnectorsDrawer = ref(false)

const strategicConnectors = [
  {
    category: 'Adição / Continuidade (D1 e D2)',
    items: ['Ademais', 'Outrossim', 'Além disso', 'Somado a isso', 'Paralelamente a isso', 'Vale ressaltar também que']
  },
  {
    category: 'Oposição / Contraponto (Antítese)',
    items: ['No entanto', 'Entretanto', 'Contudo', 'Todavia', 'Por outro lado', 'Em contrapartida', 'Não obstante']
  },
  {
    category: 'Causa e Efeito (Argumentação)',
    items: ['Haja vista que', 'Por conseguinte', 'Dessa forma', 'Em decorrência de', 'Visto que', 'Como consequência']
  },
  {
    category: 'Conclusão & Proposta C5',
    items: ['Portanto', 'Infere-se, pois, que', 'Torna-se imperioso, portanto, que', 'Em suma', 'Desse modo, cabe ao']
  },
  {
    category: 'Conformidade / Repertório',
    items: ['Consoante defende', 'Segundo o pensamento de', 'Sob a ótica de', 'Em consonância com a Constituição']
  }
]

const { data: dbTopicsData } = await useFetch('/api/student/redacao/topics')

const suggestedThemes = computed(() => {
  const dbTopics = (dbTopicsData.value?.topics || []).map(t => {
    let motivators = []
    if (t.motivationText) {
      try {
        const parsed = JSON.parse(t.motivationText)
        if (Array.isArray(parsed)) {
          motivators = parsed
        }
      } catch (e) {
        motivators = [{ title: 'Textos Motivadores Propostos', content: t.motivationText }]
      }
    }

    return {
      id: t.id,
      title: t.title,
      category: t.axis || 'Geral',
      instructions: t.description || 'A partir da leitura dos textos motivadores e com base nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo.',
      imageUrl: t.imageUrl || null,
      motivators
    }
  })

  return dbTopics
})

// Métricas
const wordCount = computed(() => {
  const text = essayText.value.trim()
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
})

const phraseCount = computed(() => {
  const text = essayText.value.trim()
  if (!text) return 0
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
})

const paragraphCount = computed(() => {
  const text = essayText.value.trim()
  if (!text) return 0
  return text.split(/\n+/).filter(p => p.trim().length > 0).length
})

// Cronômetro Formatado
const formattedTimer = computed(() => {
  const hours = Math.floor(timerSeconds.value / 3600)
  const minutes = Math.floor((timerSeconds.value % 3600) / 60)
  const seconds = timerSeconds.value % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

function toggleTimer() {
  if (timerRunning.value) {
    clearInterval(timerInterval)
    timerRunning.value = false
  } else {
    timerRunning.value = true
    timerInterval = setInterval(() => {
      timerSeconds.value++
    }, 1000)
  }
}

function resetTimer() {
  clearInterval(timerInterval)
  timerRunning.value = false
  timerSeconds.value = 0
}

function toggleFontSize() {
  if (fontSize.value === 14) fontSize.value = 15
  else if (fontSize.value === 15) fontSize.value = 16
  else if (fontSize.value === 16) fontSize.value = 17
  else fontSize.value = 14
}

async function fetchClassrooms() {
  loadingClassrooms.value = true
  try {
    const res = await $fetch('/api/student/classrooms', { credentials: 'include' })
    if (res?.classrooms) {
      classrooms.value = res.classrooms
      if (classrooms.value.length > 0) {
        selectedClassroom.value = classrooms.value[0].id
      }
    }
  } catch (err) {
    console.error('Erro ao buscar turmas', err)
  } finally {
    loadingClassrooms.value = false
  }
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Por favor, envie um arquivo de imagem válido (JPG, PNG).'
    return
  }

  photoFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removePhoto() {
  photoPreview.value = null
  photoFile.value = null
}

function selectCustomThemeFlow() {
  errorMessage.value = ''
  currentStep.value = 'CUSTOM_THEME'
}

function selectCatalogThemeFlow() {
  errorMessage.value = ''
  currentStep.value = 'CATALOG_THEME'
}

function confirmCustomTheme() {
  errorMessage.value = ''
  if (!customTheme.value.trim()) {
    errorMessage.value = 'Por favor, digite o tema da sua redação.'
    return
  }
  chosenTheme.value = customTheme.value.trim()
  selectedThemeObj.value = null
  currentStep.value = 'FORMAT_SELECTION'
}

// Ao clicar em uma proposta, abre a tela de detalhes com os TEXTOS MOTIVADORES
function openThemeDetail(theme) {
  selectedThemeObj.value = theme
  chosenTheme.value = theme.title
  currentStep.value = 'THEME_DETAIL'
}

function proceedToFormatFromDetail() {
  currentStep.value = 'FORMAT_SELECTION'
}

function chooseFormat(mode) {
  submissionMode.value = mode
  currentStep.value = 'EDITOR'

  // Iniciar cronômetro automaticamente se ainda não estiver ativo
  if (!timerRunning.value && timerSeconds.value === 0) {
    timerRunning.value = true
    timerInterval = setInterval(() => {
      timerSeconds.value++
    }, 1000)
  }
}

const showDestinationModal = ref(false)
const selectedSubmissionClassroom = ref('')

function openSubmitModal() {
  errorMessage.value = ''
  if (submissionMode.value === 'TEXT' && !essayText.value.trim()) {
    errorMessage.value = 'Por favor, escreva sua redação antes de enviar.'
    return
  }
  if (submissionMode.value === 'PHOTO' && !photoPreview.value) {
    errorMessage.value = 'Por favor, carregue a foto da redação antes de enviar.'
    return
  }

  // Se tiver turmas, define a primeira como padrão
  if (classrooms.value.length > 0) {
    selectedSubmissionClassroom.value = classrooms.value[0].id
  }

  showDestinationModal.value = true
}

async function confirmAndSubmit() {
  errorMessage.value = ''
  submitting.value = true

  try {
    const payload = {
      theme: chosenTheme.value,
      title: essayTitle.value.trim() || null,
      classroomId: selectedSubmissionClassroom.value || null,
      submissionType: submissionMode.value === 'PHOTO' ? 'IMAGE' : 'TEXT',
      content: submissionMode.value === 'TEXT' ? essayText.value : null,
      imageUrl: submissionMode.value === 'PHOTO' ? photoPreview.value : null
    }

    const res = await $fetch('/api/student/essays', {
      method: 'POST',
      credentials: 'include',
      body: payload
    })

    if (res?.success) {
      if (timerInterval) clearInterval(timerInterval)
      timerRunning.value = false
      showDestinationModal.value = false
      successSubmitted.value = true
    }
  } catch (err) {
    errorMessage.value = err.data?.message || 'Erro ao enviar a redação.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchClassrooms()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-6 space-y-4 font-sans">
    <!-- MODAL DE CONFIRMAÇÃO DE ENVIO PARA O PROFESSOR -->
    <div
      v-if="showDestinationModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      @click.self="showDestinationModal = false"
    >
      <div class="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-purple-600 text-2xl">send</span>
            <h3 class="text-base font-black text-slate-900">Enviar Redação</h3>
          </div>
          <button
            type="button"
            @click="showDestinationModal = false"
            class="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition"
          >
            <span class="material-symbols-rounded text-xl">close</span>
          </button>
        </div>

        <!-- SE O ALUNO TIVER TURMAS -->
        <div v-if="classrooms.length > 0" class="space-y-3">
          <p class="text-xs text-slate-600">
            Sua redação será encaminhada para o seu professor avaliar:
          </p>

          <div class="rounded-2xl border-2 border-purple-600 bg-purple-50/50 p-4 space-y-3">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 mt-0.5">
                <span class="material-symbols-rounded text-xl">school</span>
              </div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs sm:text-sm font-black text-slate-900">Enviar para meu Professor</h4>
                <p class="text-[11px] text-slate-500 leading-snug">
                  O professor da turma receberá a redação para correção com notas ENEM e feedback.
                </p>
              </div>
            </div>

            <div class="pt-2 border-t border-purple-200/60 space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                Selecione a Turma:
              </label>
              <select
                v-model="selectedSubmissionClassroom"
                class="w-full rounded-xl border border-purple-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-purple-600/30"
              >
                <option v-for="c in classrooms" :key="c.id" :value="c.id">
                  {{ c.name }} (Prof. {{ c.teacherName || 'Responsável' }})
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- SE O ALUNO NÃO TIVER TURMAS -->
        <div v-else class="space-y-3">
          <div class="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-4 space-y-2 text-left">
            <div class="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <span class="material-symbols-rounded text-base">info</span>
              <span>Você ainda não está em uma turma</span>
            </div>
            <p class="text-xs text-amber-700 leading-relaxed">
              Sua redação será salva no seu histórico pessoal. Para que um professor corrija suas produções, entre em uma turma através do link de convite fornecido pelo seu professor.
            </p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            @click="showDestinationModal = false"
            class="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            :disabled="submitting"
            @click="confirmAndSubmit"
            class="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-black text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition disabled:opacity-50"
          >
            <span v-if="submitting" class="material-symbols-rounded animate-spin text-xs">progress_activity</span>
            <span>Confirmar Envio</span>
            <span v-if="!submitting" class="material-symbols-rounded text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DE TEXTOS MOTIVADORES (QUANDO CLICADO EM 'VER TEMA' NO EDITOR) -->
    <div
      v-if="showMotivatorModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      @click.self="showMotivatorModal = false"
    >
      <div class="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-purple-600">article</span>
            <h3 class="text-base font-black text-slate-900">Proposta de Redação</h3>
          </div>
          <button
            type="button"
            @click="showMotivatorModal = false"
            class="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition"
          >
            <span class="material-symbols-rounded text-xl">close</span>
          </button>
        </div>

        <div class="rounded-2xl bg-purple-50 p-4 border border-purple-100">
          <span class="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Tema:</span>
          <h4 class="text-sm font-black text-slate-900 mt-1">{{ chosenTheme }}</h4>
        </div>

        <div v-if="selectedThemeObj?.motivators?.length" class="space-y-4">
          <p class="text-xs text-slate-600 italic">
            {{ selectedThemeObj.instructions }}
          </p>

          <div
            v-for="(mot, idx) in selectedThemeObj.motivators"
            :key="idx"
            class="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5"
          >
            <span class="text-[11px] font-black text-purple-700 uppercase tracking-wide">{{ mot.title }}</span>
            <p class="text-xs leading-relaxed text-slate-700 text-justify">{{ mot.content }}</p>
          </div>
        </div>

        <div v-else class="py-4 text-center text-xs text-slate-500">
          Este tema foi definido livremente por você. Continue desenvolvendo seus argumentos!
        </div>

        <div class="pt-2 flex justify-end">
          <button
            type="button"
            @click="showMotivatorModal = false"
            class="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition"
          >
            Voltar para a Redação
          </button>
        </div>
      </div>
    </div>

    <!-- TELA DE SUCESSO -->
    <div
      v-if="successSubmitted"
      class="rounded-3xl border border-purple-100 bg-white p-8 sm:p-12 text-center shadow-xl shadow-purple-500/5 space-y-4 max-w-xl mx-auto"
    >
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-600">
        <span class="material-symbols-rounded text-3xl">check_circle</span>
      </div>
      <h2 class="text-2xl font-black text-slate-900">Redação Enviada com Sucesso!</h2>
      
      <!-- Tempo gasto pelo aluno -->
      <div class="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200 px-4 py-1.5 text-xs font-bold text-purple-800">
        <span class="material-symbols-rounded text-base">timer</span>
        <span>Tempo total de produção: <strong>{{ formattedTimer }}</strong></span>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
        <span v-if="selectedSubmissionClassroom">
          Sua redação foi encaminhada com sucesso para o seu <strong>Professor</strong>. Você receberá a nota e os comentários assim que ela for corrigida!
        </span>
        <span v-else>
          Sua redação foi salva no seu histórico com sucesso. Você pode acompanhar todas as suas produções na aba Minhas Redações.
        </span>
      </p>

      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <NuxtLink
          to="/aluno/redacao/minhas"
          class="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-xs font-black text-white hover:bg-purple-700 transition shadow-md shadow-purple-600/20"
        >
          <span class="material-symbols-rounded text-base">description</span>
          <span>Ver Minhas Redações</span>
        </NuxtLink>

        <NuxtLink
          to="/aluno/redacao"
          class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
        >
          <span>Voltar ao Menu</span>
        </NuxtLink>
      </div>
    </div>

    <div v-else>
      <!-- ============================================================== -->
      <!-- ETAPA 1: MENU COM DOIS BOTÕES (TEMA LIVRE / ESCOLHER TEMA) -->
      <!-- ============================================================== -->
      <section v-if="currentStep === 'THEME_SELECTION'" class="max-w-xl mx-auto space-y-5">
        <div class="flex items-center justify-between">
          <NuxtLink
            to="/aluno/redacao"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition"
          >
            <span class="material-symbols-rounded text-sm">arrow_back</span>
            <span>Voltar</span>
          </NuxtLink>
        </div>

        <div>
          <h1 class="text-2xl font-black text-[var(--student-text)] tracking-tight">
            Como você quer definir o tema?
          </h1>
          <p class="mt-1 text-xs text-[var(--student-text-secondary)]">
            Escolha se deseja escrever sobre um tema livre ou selecionar uma proposta com textos motivadores.
          </p>
        </div>

        <!-- 2 Botões um em cima do outro -->
        <div class="space-y-3">
          <button
            type="button"
            @click="selectCustomThemeFlow"
            class="group w-full flex items-center justify-between gap-4 rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--student-primary-solid)] hover:shadow-md cursor-pointer"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--student-primary-soft)] text-[var(--student-primary-text)] transition group-hover:scale-105 group-hover:bg-[var(--student-primary-solid)] group-hover:text-white">
                <span class="material-symbols-rounded text-2xl">edit</span>
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-bold text-[var(--student-text)] transition group-hover:text-[var(--student-primary-text)]">
                  Tema livre
                </h3>
                <p class="mt-0.5 text-xs text-[var(--student-text-secondary)]">
                  Digite qualquer proposta temática da sua escolha para praticar.
                </p>
              </div>
            </div>
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--student-text-muted)] transition group-hover:text-[var(--student-primary-text)] group-hover:translate-x-1">
              <span class="material-symbols-rounded text-2xl">chevron_right</span>
            </div>
          </button>

          <button
            type="button"
            @click="selectCatalogThemeFlow"
            class="group w-full flex items-center justify-between gap-4 rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--student-primary-solid)] hover:shadow-md cursor-pointer"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--student-primary-soft)] text-[var(--student-primary-text)] transition group-hover:scale-105 group-hover:bg-[var(--student-primary-solid)] group-hover:text-white">
                <span class="material-symbols-rounded text-2xl">format_list_bulleted</span>
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-bold text-[var(--student-text)] transition group-hover:text-[var(--student-primary-text)]">
                  Escolher tema
                </h3>
                <p class="mt-0.5 text-xs text-[var(--student-text-secondary)]">
                  Selecione entre temas sugeridos nos moldes do ENEM com textos motivadores.
                </p>
              </div>
            </div>
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--student-text-muted)] transition group-hover:text-[var(--student-primary-text)] group-hover:translate-x-1">
              <span class="material-symbols-rounded text-2xl">chevron_right</span>
            </div>
          </button>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- TELA 1.1: DIGITAR TEMA LIVRE -->
      <!-- ============================================================== -->
      <section v-if="currentStep === 'CUSTOM_THEME'" class="max-w-xl mx-auto space-y-5">
        <div>
          <h1 class="text-2xl font-black text-[var(--student-text)] tracking-tight">
            Digite o seu Tema Livre
          </h1>
          <p class="mt-1 text-xs text-[var(--student-text-secondary)]">
            Insira a proposta temática completa da redação.
          </p>
        </div>

        <div class="rounded-3xl border border-[var(--student-border)] bg-[var(--student-card)] p-5 space-y-3">
          <textarea
            v-model="customTheme"
            rows="4"
            placeholder="Ex: O papel das energias renováveis na transição socioecológica do Brasil..."
            class="w-full rounded-2xl border border-[var(--student-border)] bg-[var(--student-surface)] p-4 text-sm text-[var(--student-text)] outline-none focus:border-[var(--student-primary-solid)] focus:ring-2 focus:ring-purple-600/20 transition resize-none"
          ></textarea>

          <p v-if="errorMessage" class="text-xs font-bold text-red-500">
            {{ errorMessage }}
          </p>
        </div>

        <div class="flex items-center justify-between pt-2">
          <button
            type="button"
            @click="currentStep = 'THEME_SELECTION'"
            class="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            <span class="material-symbols-rounded text-sm">arrow_back</span>
            <span>Voltar</span>
          </button>

          <button
            type="button"
            @click="confirmCustomTheme"
            class="inline-flex items-center gap-2 rounded-2xl bg-[var(--student-primary-solid)] px-6 py-3 text-xs font-black text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition"
          >
            <span>Avançar para Formato</span>
            <span class="material-symbols-rounded text-base">arrow_forward</span>
          </button>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- TELA 1.2: ESCOLHER DA LISTA DE TEMAS -->
      <!-- ============================================================== -->
      <section v-if="currentStep === 'CATALOG_THEME'" class="max-w-xl mx-auto space-y-5">
        <div>
          <h1 class="text-2xl font-black text-[var(--student-text)] tracking-tight">
            Escolha uma das Propostas
          </h1>
          <p class="mt-1 text-xs text-[var(--student-text-secondary)]">
            Clique no tema para ler os textos motivadores antes de começar a escrever.
          </p>
        </div>

        <div class="space-y-3">
          <div
            v-for="theme in suggestedThemes"
            :key="theme.id"
            @click="openThemeDetail(theme)"
            class="group rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-4 transition hover:border-[var(--student-primary-solid)] hover:shadow-md cursor-pointer flex items-center justify-between gap-4"
          >
            <div class="space-y-1.5 min-w-0">
              <span class="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase">
                {{ theme.category }}
              </span>
              <h4 class="text-xs sm:text-sm font-bold text-[var(--student-text)] group-hover:text-[var(--student-primary-text)] transition leading-snug">
                {{ theme.title }}
              </h4>
            </div>

            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--student-text-muted)] transition group-hover:text-[var(--student-primary-text)] group-hover:translate-x-1">
              <span class="material-symbols-rounded text-2xl">chevron_right</span>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <button
            type="button"
            @click="currentStep = 'THEME_SELECTION'"
            class="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            <span class="material-symbols-rounded text-sm">arrow_back</span>
            <span>Voltar</span>
          </button>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- TELA 1.3: TEXTOS MOTIVADORES DA PROPOSTA SELECIONADA -->
      <!-- ============================================================== -->
      <section v-if="currentStep === 'THEME_DETAIL'" class="max-w-2xl mx-auto space-y-5">
        <div class="flex items-center justify-between">
          <button
            type="button"
            @click="currentStep = 'CATALOG_THEME'"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition"
          >
            <span class="material-symbols-rounded text-sm">arrow_back</span>
            <span>Trocar Tema</span>
          </button>
          <span class="text-[10px] font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase">
            {{ selectedThemeObj?.category }}
          </span>
        </div>

        <!-- Banner com a Proposta -->
        <div class="rounded-3xl border border-purple-200 bg-linear-to-br from-purple-50 to-indigo-50/40 p-6 space-y-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-purple-700">Proposta de Redação:</span>
          <h2 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">
            {{ selectedThemeObj?.title }}
          </h2>
          <p class="text-xs text-slate-600 italic pt-1">
            {{ selectedThemeObj?.instructions }}
          </p>
        </div>

        <!-- Imagem / Gráfico de Apoio do Tema -->
        <div v-if="selectedThemeObj?.imageUrl" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs overflow-hidden">
          <div class="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span class="material-symbols-rounded text-purple-600">image</span>
            <span>Gráfico / Imagem de Apoio</span>
          </div>
          <img
            :src="selectedThemeObj.imageUrl"
            alt="Gráfico de Apoio"
            class="max-h-96 w-full object-contain rounded-xl bg-slate-50 border border-slate-100"
          />
        </div>

        <!-- Textos Motivadores I, II, III -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span class="material-symbols-rounded text-base text-purple-600">format_quote</span>
            <span>Textos Motivadores</span>
          </h3>

          <div
            v-for="(mot, idx) in selectedThemeObj?.motivators"
            :key="idx"
            class="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
          >
            <span class="text-xs font-black text-purple-700 uppercase tracking-wide block">
              {{ mot.title }}
            </span>
            <p v-if="mot.content" class="text-xs sm:text-sm leading-relaxed text-slate-700 text-justify whitespace-pre-line">
              {{ mot.content }}
            </p>
            <div v-if="mot.imageUrl" class="pt-2">
              <img
                :src="mot.imageUrl"
                alt="Gráfico / Imagem do Motivador"
                class="max-h-80 w-full object-contain rounded-xl bg-slate-50 border border-slate-100 p-1"
              />
            </div>
          </div>
        </div>

        <!-- Botão para avançar para redação -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            @click="currentStep = 'CATALOG_THEME'"
            class="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <span class="material-symbols-rounded text-sm">arrow_back</span>
            <span>Voltar aos Temas</span>
          </button>

          <button
            type="button"
            @click="proceedToFormatFromDetail"
            class="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-xs font-black text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition"
          >
            <span>Ir para a Redação</span>
            <span class="material-symbols-rounded text-base">arrow_forward</span>
          </button>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- ETAPA 2: ESCOLHER FORMATO (ESCREVER / ENVIAR FOTO) -->
      <!-- ============================================================== -->
      <section v-if="currentStep === 'FORMAT_SELECTION'" class="max-w-xl mx-auto space-y-5">
        <div class="rounded-2xl bg-purple-50/70 border border-purple-100 p-3.5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700">Tema Selecionado:</span>
          <p class="text-xs sm:text-sm font-black text-slate-900 mt-0.5">{{ chosenTheme }}</p>
        </div>

        <div>
          <h1 class="text-2xl font-black text-[var(--student-text)] tracking-tight">
            Como deseja enviar?
          </h1>
          <p class="mt-1 text-xs text-[var(--student-text-secondary)]">
            Escolha entre digitar no editor pautado ou enviar foto da folha manuscrita.
          </p>
        </div>

        <!-- 2 Botões um em cima do outro -->
        <div class="space-y-3">
          <button
            type="button"
            @click="chooseFormat('TEXT')"
            class="group w-full flex items-center justify-between gap-4 rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--student-primary-solid)] hover:shadow-md cursor-pointer"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--student-primary-soft)] text-[var(--student-primary-text)] transition group-hover:scale-105 group-hover:bg-[var(--student-primary-solid)] group-hover:text-white">
                <span class="material-symbols-rounded text-2xl">keyboard</span>
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-bold text-[var(--student-text)] transition group-hover:text-[var(--student-primary-text)]">
                  Escrever
                </h3>
                <p class="mt-0.5 text-xs text-[var(--student-text-secondary)]">
                  Digite seu texto no editor pautado com contagem de palavras, parágrafos e cronômetro.
                </p>
              </div>
            </div>
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--student-text-muted)] transition group-hover:text-[var(--student-primary-text)] group-hover:translate-x-1">
              <span class="material-symbols-rounded text-2xl">chevron_right</span>
            </div>
          </button>

          <button
            type="button"
            @click="chooseFormat('PHOTO')"
            class="group w-full flex items-center justify-between gap-4 rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--student-primary-solid)] hover:shadow-md cursor-pointer"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--student-primary-soft)] text-[var(--student-primary-text)] transition group-hover:scale-105 group-hover:bg-[var(--student-primary-solid)] group-hover:text-white">
                <span class="material-symbols-rounded text-2xl">photo_camera</span>
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-bold text-[var(--student-text)] transition group-hover:text-[var(--student-primary-text)]">
                  Enviar foto
                </h3>
                <p class="mt-0.5 text-xs text-[var(--student-text-secondary)]">
                  Tire uma foto ou faça upload da sua folha de redação manuscrita.
                </p>
              </div>
            </div>
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--student-text-muted)] transition group-hover:text-[var(--student-primary-text)] group-hover:translate-x-1">
              <span class="material-symbols-rounded text-2xl">chevron_right</span>
            </div>
          </button>
        </div>

        <div class="pt-2">
          <button
            type="button"
            @click="selectedThemeObj ? currentStep = 'THEME_DETAIL' : currentStep = 'CUSTOM_THEME'"
            class="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            <span class="material-symbols-rounded text-sm">arrow_back</span>
            <span>Voltar</span>
          </button>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- ETAPA 3: EDITOR DE REDAÇÃO AMPLO COM LINHAS PAUTADAS & CRONÔMETRO -->
      <!-- ============================================================== -->
      <section v-if="currentStep === 'EDITOR'" class="w-full space-y-4">
        <!-- CAMPO DE TÍTULO (OPCIONAL) -->
        <div class="text-center px-4 max-w-xl mx-auto pt-2">
          <input
            v-model="essayTitle"
            type="text"
            placeholder="Título (opcional)"
            class="w-full text-center text-sm font-medium text-slate-600 dark:text-zinc-300 placeholder-slate-400 dark:placeholder-zinc-500 border-b border-slate-300 dark:border-zinc-700 pb-1 outline-none bg-transparent focus:border-purple-600 dark:focus:border-purple-400 transition"
          />
        </div>

        <!-- ÁREA DE DIGITAÇÃO AMPLA (FOLHA PAUTADA 30 LINHAS PADRÃO ENEM) -->
        <div v-if="submissionMode === 'TEXT'" class="w-full rounded-2xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden transition-colors duration-200">
          <textarea
            v-model="essayText"
            rows="30"
            placeholder="Escreva sua redação (Linha 1)..."
            class="lined-editor-exact w-full p-0 font-sans text-slate-800 dark:text-zinc-100 outline-none resize-y bg-transparent select-text"
            :style="{ fontSize: `${fontSize}px` }"
          ></textarea>
        </div>

        <!-- MODO FOTO -->
        <div v-else class="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs space-y-3 transition-colors duration-200">
          <div
            v-if="!photoPreview"
            class="border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl p-10 text-center hover:border-purple-500 transition cursor-pointer"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handlePhotoUpload"
            />
            <span class="material-symbols-rounded text-5xl text-purple-600 dark:text-purple-400 mb-2">add_photo_alternate</span>
            <p class="text-sm font-bold text-slate-800 dark:text-zinc-200">Clique para selecionar ou tirar foto da folha</p>
          </div>

          <div v-else class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span class="material-symbols-rounded text-sm">check_circle</span>
                Foto carregada com sucesso
              </span>
              <button type="button" @click="removePhoto" class="text-xs text-red-500 font-bold hover:underline cursor-pointer">
                Remover foto
              </button>
            </div>
            <img :src="photoPreview" alt="Folha da redação" class="max-h-96 mx-auto rounded-xl object-contain shadow-sm" />
          </div>
        </div>

        <!-- SEÇÃO: FERRAMENTAS -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-slate-500 dark:text-zinc-400">Ferramentas</span>

          <!-- Botões Fonte, Timer & Guia de Conectivos -->
          <div class="grid grid-cols-3 gap-2">
            <!-- Botão Fonte -->
            <button
              type="button"
              @click="toggleFontSize"
              class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition cursor-pointer border border-slate-200/60 dark:border-zinc-700/60"
            >
              <span class="material-symbols-rounded text-base">text_fields</span>
              <span>Fonte ({{ fontSize }}px)</span>
            </button>

            <!-- Botão Timer / Cronômetro -->
            <button
              type="button"
              @click="toggleTimer"
              class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition text-xs font-bold cursor-pointer border"
              :class="timerRunning ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200/60 dark:border-zinc-700/60 hover:bg-slate-200 dark:hover:bg-zinc-700'"
            >
              <span class="material-symbols-rounded text-base">timer</span>
              <span>{{ timerRunning ? `Pausar (${formattedTimer})` : `Timer (${formattedTimer})` }}</span>
            </button>

            <!-- Botão Guia de Conectivos C4 -->
            <button
              type="button"
              @click="showConnectorsDrawer = true"
              class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition text-xs font-black cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">link</span>
              <span>Conectivos C4</span>
            </button>
          </div>
        </div>

        <!-- SEÇÃO: VISÃO GERAL -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-slate-500 dark:text-zinc-400">Visão Geral</span>

          <div class="grid grid-cols-3 gap-2">
            <div class="rounded-xl bg-slate-100 dark:bg-zinc-800 p-3 border border-slate-200/60 dark:border-zinc-700/60">
              <span class="text-[11px] text-slate-500 dark:text-zinc-400 block">Palavras:</span>
              <p class="text-sm font-bold text-red-600 dark:text-red-400 mt-0.5">{{ wordCount }}</p>
            </div>

            <div class="rounded-xl bg-slate-100 dark:bg-zinc-800 p-3 border border-slate-200/60 dark:border-zinc-700/60">
              <span class="text-[11px] text-slate-500 dark:text-zinc-400 block">Frases:</span>
              <p class="text-sm font-bold text-red-600 dark:text-red-400 mt-0.5">{{ phraseCount }}</p>
            </div>

            <div class="rounded-xl bg-slate-100 dark:bg-zinc-800 p-3 border border-slate-200/60 dark:border-zinc-700/60">
              <span class="text-[11px] text-slate-500 dark:text-zinc-400 block">Parágrafos:</span>
              <p class="text-sm font-bold text-red-600 dark:text-red-400 mt-0.5">{{ paragraphCount }}</p>
            </div>
          </div>
        </div>

        <!-- SEÇÃO: TEMA E TEXTOS MOTIVADORES -->
        <div class="space-y-1.5">
          <span class="text-xs font-bold text-slate-500 dark:text-zinc-400">Tema</span>

          <div class="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-zinc-800 p-3 text-xs text-slate-700 dark:text-zinc-200 border border-slate-200/60 dark:border-zinc-700/60">
            <span class="font-medium truncate pr-2" :title="chosenTheme">
              {{ chosenTheme }}
            </span>
            <button
              type="button"
              @click="showMotivatorModal = true"
              class="shrink-0 flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 transition cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">open_in_full</span>
              <span>Ver textos motivadores</span>
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="text-xs font-bold text-red-500">
          {{ errorMessage }}
        </p>

        <!-- FOOTER BAR (VOLTAR, INDICADORES DE PASSO, ENVIAR) -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-200">
          <button
            type="button"
            @click="currentStep = 'FORMAT_SELECTION'"
            class="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 transition uppercase"
          >
            <span class="material-symbols-rounded text-sm">chevron_left</span>
            <span>VOLTAR</span>
          </button>

          <!-- Pontos Indicadores -->
          <div class="flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-slate-300"></span>
            <span class="h-2 w-2 rounded-full bg-slate-300"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-purple-600"></span>
          </div>

          <!-- Botão Enviar Roxo Padrão do Projeto -->
          <button
            type="button"
            :disabled="submitting || (submissionMode === 'TEXT' ? !essayText.trim() : !photoPreview)"
            @click="openSubmitModal"
            class="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-black text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition disabled:opacity-50 active:scale-98 uppercase tracking-wide cursor-pointer"
          >
            <span v-if="submitting" class="material-symbols-rounded animate-spin text-xs">progress_activity</span>
            <span>ENVIAR</span>
            <span v-if="!submitting" class="material-symbols-rounded text-sm">chevron_right</span>
          </button>
        </div>
      </section>
    </div>

    <!-- Drawer Lateral: Banco de Conectivos e Operadores Argumentativos C4 -->
    <Teleport to="body">
      <Transition name="slide">
        <div v-if="showConnectorsDrawer" class="fixed inset-0 z-50 flex justify-end">
          <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs" @click="showConnectorsDrawer = false"></div>
          <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 font-sans">
            <div class="flex items-center justify-between p-4 border-b border-slate-100 bg-purple-50/50">
              <div class="flex items-center gap-2 text-purple-800">
                <span class="material-symbols-rounded text-xl">link</span>
                <div>
                  <h3 class="text-sm font-black text-slate-900">Banco de Conectivos ENEM</h3>
                  <p class="text-[11px] text-purple-700">Operadores Argumentativos para a Competência 4</p>
                </div>
              </div>
              <button
                type="button"
                @click="showConnectorsDrawer = false"
                class="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white transition"
              >
                <span class="material-symbols-rounded text-xl">close</span>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <div
                v-for="(cat, idx) in strategicConnectors"
                :key="idx"
                class="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2"
              >
                <span class="text-xs font-black text-purple-900 block">
                  {{ cat.category }}
                </span>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="item in cat.items"
                    :key="item"
                    class="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs select-all hover:border-purple-300 transition"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Folha Pautada com Espaço Amplo (30 Linhas x 32px = 960px) */
.lined-editor-exact {
  display: block;
  width: 100%;
  line-height: 32px !important;
  font-size: 15px;
  padding: 0 16px !important;
  margin: 0 !important;
  border: none !important;
  outline: none !important;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 31px,
    #e2e8f0 31px,
    #e2e8f0 32px
  );
  background-size: 100% 32px;
  background-position: 0 0;
  background-attachment: local;
  min-height: 960px; /* 30 linhas completas do ENEM */
  box-sizing: border-box;
}

:global(html.dark) .lined-editor-exact,
:global([data-theme="dark"]) .lined-editor-exact {
  color: #fafafa !important;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 31px,
    #27272a 31px,
    #27272a 32px
  );
}

.lined-editor-exact::placeholder {
  color: #94a3b8;
  line-height: 32px !important;
}

:global(html.dark) .lined-editor-exact::placeholder,
:global([data-theme="dark"]) .lined-editor-exact::placeholder {
  color: #71717a;
}
</style>
