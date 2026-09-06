<script setup>
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'aluno'
})

useSeoMeta({
  title: 'Minhas Redações — Área do Aluno | Conectar ENEM'
})

const authStore = useAuthStore()

const loading = ref(true)
const essays = ref([])
const activeFilter = ref('ALL') // 'ALL', 'PENDING', 'GRADED'
const searchQuery = ref('')
const selectedEssay = ref(null)

async function fetchMyEssays() {
  loading.value = true
  try {
    const res = await $fetch('/api/student/essays', { credentials: 'include' })
    if (res?.essays) {
      essays.value = res.essays
    }
  } catch (err) {
    console.error('Erro ao carregar redações do aluno:', err)
  } finally {
    loading.value = false
  }
}

const filteredEssays = computed(() => {
  return essays.value.filter(essay => {
    // Filtro por status
    if (activeFilter.value === 'PENDING' && essay.status !== 'PENDING') return false
    if (activeFilter.value === 'GRADED' && essay.status !== 'GRADED') return false

    // Filtro por busca de tema ou título
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchTheme = essay.theme?.toLowerCase().includes(q)
      const matchTitle = essay.title?.toLowerCase().includes(q)
      return matchTheme || matchTitle
    }

    return true
  })
})

const stats = computed(() => {
  const total = essays.value.length
  const pending = essays.value.filter(e => e.status === 'PENDING').length
  const graded = essays.value.filter(e => e.status === 'GRADED').length

  const gradedEssays = essays.value.filter(e => e.status === 'GRADED' && e.correction)
  const averageScore = gradedEssays.length > 0
    ? Math.round(gradedEssays.reduce((acc, curr) => acc + (curr.correction.totalScore || 0), 0) / gradedEssays.length)
    : 0

  return { total, pending, graded, averageScore }
})

function formatDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function openEssayDetail(essay) {
  selectedEssay.value = essay
}

onMounted(() => {
  fetchMyEssays()
})
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 space-y-6 font-sans">
    <!-- MODAL DE DETALHES DA REDAÇÃO / CORREÇÃO DO PROFESSOR -->
    <div
      v-if="selectedEssay"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs"
      @click.self="selectedEssay = null"
    >
      <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--student-border)] bg-[var(--student-surface)] p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <!-- HEADER DO MODAL -->
        <div class="flex items-start justify-between border-b border-[var(--student-border)] pb-4">
          <div class="space-y-1.5 min-w-0 pr-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-[var(--student-primary-text)] bg-[var(--student-primary-soft)] px-3 py-1 rounded-full inline-block">
              {{ selectedEssay.classroom ? `Turma: ${selectedEssay.classroom.name}` : 'Histórico Pessoal' }}
            </span>
            <h3 class="text-base sm:text-lg font-black text-[var(--student-text)] leading-snug">
              {{ selectedEssay.title || selectedEssay.theme }}
            </h3>
            <p v-if="selectedEssay.title" class="text-xs text-[var(--student-text-secondary)]">
              Tema: {{ selectedEssay.theme }}
            </p>
          </div>

          <button
            type="button"
            @click="selectedEssay = null"
            class="h-8 w-8 shrink-0 rounded-full text-[var(--student-text-muted)] hover:bg-[var(--student-surface-secondary)] hover:text-[var(--student-text)] flex items-center justify-center transition cursor-pointer"
          >
            <span class="material-symbols-rounded text-xl">close</span>
          </button>
        </div>

        <!-- SEÇÃO DE CORREÇÃO DO PROFESSOR (SE ESTIVER AVALIADA) -->
        <div v-if="selectedEssay.status === 'GRADED' && selectedEssay.correction" class="space-y-4">
          <div class="rounded-3xl bg-linear-to-r from-purple-700 via-purple-600 to-indigo-700 p-6 text-white shadow-xl shadow-purple-900/10 flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs font-bold text-purple-200 uppercase tracking-wider block">Nota Oficial ENEM</span>
              <p class="text-xs text-purple-100 font-medium">
                Corrigido por: <strong class="text-white">{{ selectedEssay.correction.teacher?.name || 'Professor' }}</strong>
              </p>
            </div>

            <div class="text-right">
              <span class="text-3xl sm:text-4xl font-black text-white">
                {{ selectedEssay.correction.totalScore }}
              </span>
              <span class="text-xs text-purple-200 font-bold block">/ 1000 pts</span>
            </div>
          </div>

          <!-- NOTAS POR COMPETÊNCIA -->
          <div class="space-y-2.5">
            <h4 class="text-xs font-black uppercase tracking-wider text-[var(--student-text-secondary)]">
              Desempenho por Competência ENEM
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-4 space-y-1">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-[var(--student-text)]">C1 - Gramática & Norma Culta</span>
                  <span class="font-black text-[var(--student-primary-text)] bg-[var(--student-primary-soft)] px-2 py-0.5 rounded-md">{{ selectedEssay.correction.c1Score }} pts</span>
                </div>
                <p v-if="selectedEssay.correction.c1Comment" class="text-xs text-[var(--student-text-secondary)] italic">
                  "{{ selectedEssay.correction.c1Comment }}"
                </p>
              </div>

              <div class="rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-4 space-y-1">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-[var(--student-text)]">C2 - Compreensão do Tema</span>
                  <span class="font-black text-[var(--student-primary-text)] bg-[var(--student-primary-soft)] px-2 py-0.5 rounded-md">{{ selectedEssay.correction.c2Score }} pts</span>
                </div>
                <p v-if="selectedEssay.correction.c2Comment" class="text-xs text-[var(--student-text-secondary)] italic">
                  "{{ selectedEssay.correction.c2Comment }}"
                </p>
              </div>

              <div class="rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-4 space-y-1">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-[var(--student-text)]">C3 - Argumentação & Repertório</span>
                  <span class="font-black text-[var(--student-primary-text)] bg-[var(--student-primary-soft)] px-2 py-0.5 rounded-md">{{ selectedEssay.correction.c3Score }} pts</span>
                </div>
                <p v-if="selectedEssay.correction.c3Comment" class="text-xs text-[var(--student-text-secondary)] italic">
                  "{{ selectedEssay.correction.c3Comment }}"
                </p>
              </div>

              <div class="rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-4 space-y-1">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-[var(--student-text)]">C4 - Coesão & Conectivos</span>
                  <span class="font-black text-[var(--student-primary-text)] bg-[var(--student-primary-soft)] px-2 py-0.5 rounded-md">{{ selectedEssay.correction.c4Score }} pts</span>
                </div>
                <p v-if="selectedEssay.correction.c4Comment" class="text-xs text-[var(--student-text-secondary)] italic">
                  "{{ selectedEssay.correction.c4Comment }}"
                </p>
              </div>
            </div>

            <!-- C5 -->
            <div class="rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-4 space-y-1">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-[var(--student-text)]">C5 - Proposta de Intervenção</span>
                <span class="font-black text-[var(--student-primary-text)] bg-[var(--student-primary-soft)] px-2 py-0.5 rounded-md">{{ selectedEssay.correction.c5Score }} pts</span>
              </div>
              <p v-if="selectedEssay.correction.c5Comment" class="text-xs text-[var(--student-text-secondary)] italic">
                "{{ selectedEssay.correction.c5Comment }}"
              </p>
            </div>
          </div>

          <!-- COMENTÁRIO GERAL DO PROFESSOR -->
          <div v-if="selectedEssay.correction.generalFeedback" class="rounded-2xl border border-[var(--student-primary-solid)]/30 bg-[var(--student-primary-soft)] p-4 space-y-1.5">
            <span class="text-xs font-bold text-[var(--student-primary-text)] flex items-center gap-1.5">
              <span class="material-symbols-rounded text-base">chat</span>
              Comentário Pedagógico do Professor:
            </span>
            <p class="text-xs text-[var(--student-text)] leading-relaxed">
              {{ selectedEssay.correction.generalFeedback }}
            </p>
          </div>
        </div>

        <!-- STATUS AGUARDANDO CORREÇÃO -->
        <div v-else class="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-600 space-y-1">
          <div class="flex items-center gap-2 font-bold">
            <span class="material-symbols-rounded text-base text-amber-500">hourglass_top</span>
            <span>Aguardando Correção do Professor</span>
          </div>
          <p class="text-[11px] opacity-90">
            Sua redação foi enviada para a fila de correção. Assim que o professor publicar a nota, as 5 competências e feedbacks detalhados ficarão disponíveis aqui.
          </p>
        </div>

        <!-- TEXTO DA REDAÇÃO / FOTO ENVIADA -->
        <div class="space-y-2.5 border-t border-[var(--student-border)] pt-4">
          <h4 class="text-xs font-black uppercase tracking-wider text-[var(--student-text-secondary)]">
            Seu Texto Submetido
          </h4>

          <div v-if="selectedEssay.submissionType === 'TEXT'" class="rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-5 text-xs sm:text-sm leading-relaxed text-[var(--student-text)] whitespace-pre-line text-justify max-h-72 overflow-y-auto">
            {{ selectedEssay.content }}
          </div>

          <div v-else class="text-center">
            <img :src="selectedEssay.imageUrl" alt="Folha manuscrita" class="max-h-96 mx-auto rounded-2xl border border-[var(--student-border)] shadow-xs" />
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="button"
            @click="selectedEssay = null"
            class="rounded-xl bg-[var(--student-surface-secondary)] px-5 py-2.5 text-xs font-bold text-[var(--student-text)] hover:bg-[var(--student-border)] transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>

    <!-- TOPO DE NAVEGAÇÃO -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <NuxtLink
          to="/aluno/redacao"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--student-primary-text)] hover:underline transition"
        >
          <span class="material-symbols-rounded text-sm">arrow_back</span>
          <span>Voltar ao Menu de Redação</span>
        </NuxtLink>
        <h1 class="text-2xl sm:text-3xl font-black text-[var(--student-text)] tracking-tight">
          Minhas Redações
        </h1>
        <p class="text-xs text-[var(--student-text-secondary)]">
          Acompanhe o status, notas e o feedback detalhado do seu professor.
        </p>
      </div>

      <NuxtLink
        to="/aluno/redacao/nova"
        class="inline-flex items-center gap-2 rounded-2xl bg-[var(--student-primary-solid)] px-5 py-3 text-xs font-black text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition cursor-pointer"
      >
        <span class="material-symbols-rounded text-base">add</span>
        <span>Nova Redação</span>
      </NuxtLink>
    </div>

    <!-- CARDS DE ESTATÍSTICAS DO ALUNO (COM CORES CONSISTENTES NO MODO CLARO E ESCURO) -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-4 space-y-1 shadow-xs transition hover:border-[var(--student-primary-solid)]">
        <span class="text-[11px] font-bold text-[var(--student-text-secondary)] block">Total Enviadas</span>
        <span class="text-2xl font-black text-[var(--student-text)]">{{ stats.total }}</span>
      </div>

      <div class="rounded-2xl border border-amber-500/20 bg-[var(--student-card)] p-4 space-y-1 shadow-xs transition hover:border-amber-500">
        <span class="text-[11px] font-bold text-amber-500 block">Aguardando Nota</span>
        <span class="text-2xl font-black text-amber-500">{{ stats.pending }}</span>
      </div>

      <div class="rounded-2xl border border-purple-500/20 bg-[var(--student-card)] p-4 space-y-1 shadow-xs transition hover:border-purple-500">
        <span class="text-[11px] font-bold text-[var(--student-primary-text)] block">Corrigidas</span>
        <span class="text-2xl font-black text-[var(--student-primary-text)]">{{ stats.graded }}</span>
      </div>

      <div class="rounded-2xl border border-indigo-500/20 bg-[var(--student-card)] p-4 space-y-1 shadow-xs transition hover:border-indigo-500">
        <span class="text-[11px] font-bold text-indigo-400 block">Média Geral</span>
        <span class="text-2xl font-black text-indigo-400">{{ stats.averageScore }} <span class="text-xs text-[var(--student-text-muted)] font-normal">pts</span></span>
      </div>
    </div>

    <!-- BARRA DE PESQUISA & FILTROS -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
      <!-- Filtros por status -->
      <div class="flex items-center gap-1.5 p-1 bg-[var(--student-surface-secondary)] border border-[var(--student-border)] rounded-2xl w-full sm:w-auto">
        <button
          type="button"
          @click="activeFilter = 'ALL'"
          class="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          :class="activeFilter === 'ALL' ? 'bg-[var(--student-primary-solid)] text-white shadow-xs' : 'text-[var(--student-text-secondary)] hover:text-[var(--student-text)]'"
        >
          Todas ({{ stats.total }})
        </button>

        <button
          type="button"
          @click="activeFilter = 'PENDING'"
          class="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          :class="activeFilter === 'PENDING' ? 'bg-[var(--student-primary-solid)] text-white shadow-xs' : 'text-[var(--student-text-secondary)] hover:text-[var(--student-text)]'"
        >
          Pendentes ({{ stats.pending }})
        </button>

        <button
          type="button"
          @click="activeFilter = 'GRADED'"
          class="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          :class="activeFilter === 'GRADED' ? 'bg-[var(--student-primary-solid)] text-white shadow-xs' : 'text-[var(--student-text-secondary)] hover:text-[var(--student-text)]'"
        >
          Corrigidas ({{ stats.graded }})
        </button>
      </div>

      <!-- Busca por tema/título -->
      <div class="relative w-full sm:w-72">
        <span class="material-symbols-rounded absolute left-3.5 top-2.5 text-[var(--student-text-muted)] text-lg">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por tema ou título..."
          class="w-full rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] py-2 pl-10 pr-4 text-xs text-[var(--student-text)] placeholder-[var(--student-text-muted)] outline-none focus:border-[var(--student-primary-solid)] transition"
        />
      </div>
    </div>

    <!-- LISTAGEM DE REDAÇÕES -->
    <div v-if="loading" class="py-16 text-center">
      <span class="material-symbols-rounded animate-spin text-3xl text-[var(--student-primary-text)]">progress_activity</span>
      <p class="mt-2 text-xs font-bold text-[var(--student-text-secondary)]">Carregando suas redações...</p>
    </div>

    <div v-else-if="filteredEssays.length === 0" class="rounded-3xl border border-[var(--student-border)] bg-[var(--student-card)] p-12 text-center space-y-3">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--student-primary-soft)] text-[var(--student-primary-text)]">
        <span class="material-symbols-rounded text-3xl">description</span>
      </div>
      <h3 class="text-base font-bold text-[var(--student-text)]">Nenhuma redação encontrada</h3>
      <p class="text-xs text-[var(--student-text-secondary)] max-w-sm mx-auto">
        {{ searchQuery ? 'Nenhuma redação corresponde aos termos da busca.' : 'Você ainda não enviou redações nesta categoria. Comece a praticar agora mesmo!' }}
      </p>
      <NuxtLink
        v-if="!searchQuery"
        to="/aluno/redacao/nova"
        class="inline-flex items-center gap-1.5 rounded-xl bg-[var(--student-primary-solid)] px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition"
      >
        <span class="material-symbols-rounded text-sm">edit</span>
        <span>Escrever Nova Redação</span>
      </NuxtLink>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="essay in filteredEssays"
        :key="essay.id"
        @click="openEssayDetail(essay)"
        class="group rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--student-primary-solid)] hover:shadow-md cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div class="space-y-2 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full"
              :class="essay.status === 'GRADED' ? 'bg-[var(--student-primary-soft)] text-[var(--student-primary-text)]' : 'bg-amber-500/15 text-amber-500'"
            >
              {{ essay.status === 'GRADED' ? 'Corrigida' : 'Aguardando Correção' }}
            </span>

            <span class="text-[11px] text-[var(--student-text-muted)]">
              {{ formatDate(essay.createdAt) }}
            </span>

            <span v-if="essay.classroom" class="text-[11px] font-bold text-[var(--student-text-secondary)] flex items-center gap-1">
              <span class="material-symbols-rounded text-xs">school</span>
              {{ essay.classroom.name }}
            </span>
          </div>

          <h3 class="text-sm sm:text-base font-bold text-[var(--student-text)] group-hover:text-[var(--student-primary-text)] transition leading-snug">
            {{ essay.title || essay.theme }}
          </h3>
          <p v-if="essay.title" class="text-xs text-[var(--student-text-secondary)] truncate">
            Tema: {{ essay.theme }}
          </p>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[var(--student-border)]">
          <!-- Nota em destaque se corrigida -->
          <div v-if="essay.status === 'GRADED' && essay.correction" class="text-right">
            <span class="text-2xl font-black text-[var(--student-primary-text)]">{{ essay.correction.totalScore }}</span>
            <span class="text-[10px] text-[var(--student-text-muted)] font-bold block">pontos</span>
          </div>

          <div class="flex items-center gap-1 text-xs font-bold text-[var(--student-primary-text)] group-hover:translate-x-1 transition">
            <span>{{ essay.status === 'GRADED' ? 'Ver Nota & Feedback' : 'Ver Redação' }}</span>
            <span class="material-symbols-rounded text-lg">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
