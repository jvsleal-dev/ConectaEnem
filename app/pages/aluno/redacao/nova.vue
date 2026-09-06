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
const submitting = ref(false)
const errorMessage = ref('')
const successSubmitted = ref(false)
const showMotivatorModal = ref(false)

// Banco de Temas com Textos Motivadores Reais no Padrão ENEM
const suggestedThemes = [
  {
    id: 1,
    title: 'Desafios para a valorização da herança africana e dos povos originários no Brasil',
    category: 'Sociedade & Cultura',
    instructions: 'A partir da leitura dos textos motivadores seguintes e com base nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema.',
    motivators: [
      {
        title: 'Texto I',
        content: 'A história do Brasil foi moldada pela pluralidade de saberes, línguas e tradições trazidas pelos povos africanos escravizados e pelos povos originários que já habitavam este território. No entanto, o processo de apagamento histórico e o racismo estrutural resultaram na invisibilização dessas contribuições nos currículos escolares e nos espaços de decisão e representatividade.'
      },
      {
        title: 'Texto II',
        content: 'Segundo dados do Censo Escolar e do Ministério da Educação, embora as Leis nº 10.639/03 e 11.645/08 tornem obrigatório o ensino de História e Cultura Afro-Brasileira e Indígena, mais da metade dos municípios brasileiros ainda não contam com diretrizes consolidadas e formação continuada para os docentes.'
      },
      {
        title: 'Texto III',
        content: 'A valorização das matrizes africanas e indígenas não é apenas um resgate da memória coletiva, mas um compromisso ético e constitucional para a garantia da cidadania, soberania territorial e erradicação de preconceitos históricos.'
      }
    ]
  },
  {
    id: 2,
    title: 'Impactos e regulamentação da inteligência artificial na educação e no mercado de trabalho',
    category: 'Tecnologia & Educação',
    instructions: 'A partir da leitura dos textos motivadores e com base em seu repertório sociocultural, desenvolva uma proposta de intervenção social para o tema.',
    motivators: [
      {
        title: 'Texto I',
        content: 'A ascensão de sistemas baseados em inteligência artificial generativa transforma a produção do conhecimento. No âmbito educacional, surgem debates sobre a personalização da aprendizagem versus o risco de atrofia do pensamento crítico e plágio sistemático.'
      },
      {
        title: 'Texto II',
        content: 'Relatório do Fórum Econômico Mundial aponta que até 2030 milhões de postos de trabalho serão automatizados, ao mesmo tempo em que novas profissões voltadas à supervisão ética e gestão tecnológica emergirão. A disparidade de acesso a essas ferramentas aprofunda a desigualdade socioeconômica.'
      },
      {
        title: 'Texto III',
        content: 'O Marco Legal da Inteligência Artificial em debate no Congresso Nacional busca equilibrar inovação com proteção de dados, direitos autorais e mitigação de vieses algorítmicos discriminatórios.'
      }
    ]
  },
  {
    id: 3,
    title: 'Caminhos para combater a crise climática e a insegurança alimentar no país',
    category: 'Meio Ambiente & Cidadania',
    instructions: 'Com base nos textos motivadores, elabore um texto dissertativo-argumentativo apresentando proposta de intervenção.',
    motivators: [
      {
        title: 'Texto I',
        content: 'Eventos climáticos extremos como secas prolongadas e inundações afetam diretamente a agricultura familiar, responsável pela maior parte dos alimentos que chegam à mesa da população brasileira.'
      },
      {
        title: 'Texto II',
        content: 'O Brasil voltou ao Mapa da Fome da ONU, evidenciando que a perda de colheitas, a inflação alimentar e a degradação dos solos impactam com maior severidade as populações em situação de vulnerabilidade periférica e rural.'
      },
      {
        title: 'Texto III',
        content: 'A agroecologia e a restauração de biomas surgem como alternativas viáveis para associar segurança alimentar à preservação do equilíbrio ambiental e diminuição da emissão de gases estufa.'
      }
    ]
  },
  {
    id: 4,
    title: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
    category: 'Direitos Humanos',
    instructions: 'Redija uma dissertação-argumentativa formal com proposta de intervenção que respeite os direitos humanos.',
    motivators: [
      {
        title: 'Texto I',
        content: 'Toda pessoa tem direito ao reconhecimento como pessoa perante a lei. A certidão de nascimento é o primeiro documento que assegura o exercício da cidadania e a existência legal do indivíduo.'
      },
      {
        title: 'Texto II',
        content: 'Sem a certidão de nascimento, o cidadão não consegue emitir RG, CPF, matricular-se na rede pública de ensino ou acessar programas de transferência de renda e vacinação.'
      },
      {
        title: 'Texto III',
        content: 'Ações itinerantes da Justiça e gratuidade dos cartórios são vitais para erradicar o sub-registro civil que ainda atinge milhares de brasileiros em áreas isoladas.'
      }
    ]
  },
  {
    id: 5,
    title: 'A importância da saúde mental e os estigmas associados às doenças psíquicas na juventude',
    category: 'Saúde Pública',
    instructions: 'Analise o cenário com base nos textos motivadores e redija sua redação nos moldes do ENEM.',
    motivators: [
      {
        title: 'Texto I',
        content: 'A cobrança por desempenho acadêmico, a hiperconectividade nas redes sociais e a falta de espaços de acolhimento têm ampliado os índices de ansiedade e depressão entre adolescentes e jovens adultos.'
      },
      {
        title: 'Texto II',
        content: 'Ainda persiste na sociedade o tabu de que problemas de saúde mental representam fraqueza ou falta de esforço, postergando a busca por auxílio profissional e tratamento psicológico.'
      },
      {
        title: 'Texto III',
        content: 'A atuação integrada da atenção primária à saúde com o ambiente escolar (Programa Saúde na Escola) é indispensável para a identificação precoce e suporte emocional.'
      }
    ]
  }
]

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

    <template v-else>
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

        <!-- Textos Motivadores I, II, III -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span class="material-symbols-rounded text-base text-purple-600">format_quote</span>
            <span>Textos Motivadores</span>
          </h3>

          <div
            v-for="(mot, idx) in selectedThemeObj?.motivators"
            :key="idx"
            class="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs"
          >
            <span class="text-xs font-black text-purple-700 uppercase tracking-wide">
              {{ mot.title }}
            </span>
            <p class="text-xs sm:text-sm leading-relaxed text-slate-700 text-justify">
              {{ mot.content }}
            </p>
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
            class="w-full text-center text-sm font-medium text-slate-600 placeholder-slate-400 border-b border-slate-300 pb-1 outline-none bg-transparent focus:border-purple-600 transition"
          />
        </div>

        <!-- ÁREA DE DIGITAÇÃO AMPLA (FOLHA PAUTADA 30 LINHAS PADRÃO ENEM) -->
        <div v-if="submissionMode === 'TEXT'" class="w-full rounded-2xl border border-slate-300 bg-white shadow-xs overflow-hidden">
          <textarea
            v-model="essayText"
            rows="30"
            placeholder="Escreva sua redação (Linha 1)..."
            class="lined-editor-exact w-full p-0 font-sans text-slate-800 outline-none resize-y bg-transparent select-text"
            :style="{ fontSize: `${fontSize}px` }"
          ></textarea>
        </div>

        <!-- MODO FOTO -->
        <div v-else class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div
            v-if="!photoPreview"
            class="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-purple-500 transition cursor-pointer"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handlePhotoUpload"
            />
            <span class="material-symbols-rounded text-5xl text-purple-600 mb-2">add_photo_alternate</span>
            <p class="text-sm font-bold text-slate-800">Clique para selecionar ou tirar foto da folha</p>
          </div>

          <div v-else class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span class="material-symbols-rounded text-sm">check_circle</span>
                Foto carregada com sucesso
              </span>
              <button type="button" @click="removePhoto" class="text-xs text-red-500 font-bold hover:underline">
                Remover foto
              </button>
            </div>
            <img :src="photoPreview" alt="Folha da redação" class="max-h-96 mx-auto rounded-xl object-contain shadow-sm" />
          </div>
        </div>

        <!-- SEÇÃO: FERRAMENTAS -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-slate-500">Ferramentas</span>

          <!-- Botões Fonte & Timer -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Botão Fonte -->
            <button
              type="button"
              @click="toggleFontSize"
              class="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">text_fields</span>
              <span>Fonte ({{ fontSize }}px)</span>
            </button>

            <!-- Botão Timer / Cronômetro -->
            <button
              type="button"
              @click="toggleTimer"
              class="flex items-center justify-center gap-2 py-2.5 rounded-xl transition text-xs font-bold cursor-pointer"
              :class="timerRunning ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            >
              <span class="material-symbols-rounded text-base">timer</span>
              <span>{{ timerRunning ? `Pausar (${formattedTimer})` : `Iniciar (${formattedTimer})` }}</span>
            </button>
          </div>
        </div>

        <!-- SEÇÃO: VISÃO GERAL -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-slate-500">Visão Geral</span>

          <div class="grid grid-cols-3 gap-2">
            <div class="rounded-xl bg-slate-100 p-3">
              <span class="text-[11px] text-slate-500 block">Palavras:</span>
              <p class="text-sm font-bold text-red-600 mt-0.5">{{ wordCount }}</p>
            </div>

            <div class="rounded-xl bg-slate-100 p-3">
              <span class="text-[11px] text-slate-500 block">Frases:</span>
              <p class="text-sm font-bold text-red-600 mt-0.5">{{ phraseCount }}</p>
            </div>

            <div class="rounded-xl bg-slate-100 p-3">
              <span class="text-[11px] text-slate-500 block">Parágrafos:</span>
              <p class="text-sm font-bold text-red-600 mt-0.5">{{ paragraphCount }}</p>
            </div>
          </div>
        </div>

        <!-- SEÇÃO: TEMA E TEXTOS MOTIVADORES -->
        <div class="space-y-1.5">
          <span class="text-xs font-bold text-slate-500">Tema</span>

          <div class="flex items-center justify-between rounded-xl bg-slate-100 p-3 text-xs text-slate-700">
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
    </template>
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

.lined-editor-exact::placeholder {
  color: #94a3b8;
  line-height: 32px !important;
}
</style>
