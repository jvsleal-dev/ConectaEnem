<script setup>
definePageMeta({
  layout: 'aluno',
})

useSeoMeta({
  title: 'Aulas — Conectar ENEM',
  description: 'Assista às aulas organizadas por matéria e módulo.'
})

// --- Estado ---
const selectedSubjectId = ref(null)
const searchQuery = ref('')
const searchDebounced = ref('')
const expandedModules = ref(new Set())
let debounceTimer = null

// --- Busca com debounce ---
watch(searchQuery, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchDebounced.value = val
  }, 350)
})

// --- Fetch do backend ---
const { data: subjectsData } = await useFetch('/api/student/aulas', {
  credentials: 'include'
})

const { data, pending, error, refresh } = await useFetch('/api/student/aulas', {
  credentials: 'include',
  query: computed(() => ({
    ...(selectedSubjectId.value ? { subjectId: selectedSubjectId.value } : {}),
    ...(searchDebounced.value ? { search: searchDebounced.value } : {})
  })),
  watch: [selectedSubjectId, searchDebounced]
})

const subjects = computed(() => data.value?.subjects || [])

// Mantém todas as matérias nos filtros, mesmo depois de uma seleção.
const filterSubjects = computed(() => subjectsData.value?.subjects || [])

// Contagem de aulas por matéria
function countLessons(subject) {
  return subject.modules.reduce((sum, m) => sum + m.lessons.length, 0)
}

// Toggle módulo expandido
function toggleModule(moduleId) {
  if (expandedModules.value.has(moduleId)) {
    expandedModules.value.delete(moduleId)
  } else {
    expandedModules.value.add(moduleId)
  }
  expandedModules.value = new Set(expandedModules.value)
}

// Expandir todos ao buscar
watch(searchDebounced, (val) => {
  if (val) {
    const ids = new Set()
    subjects.value.forEach(s => s.modules.forEach(m => {
      if (m.lessons.length > 0) ids.add(m.id)
    }))
    expandedModules.value = ids
  }
})

onBeforeUnmount(() => clearTimeout(debounceTimer))

// Extrair ID do vídeo do YouTube
function getYoutubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/)
  return match ? match[1] : null
}

function getVideoThumbnail(url) {
  const id = getYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

// Modal de vídeo
const activeLesson = ref(null)

const loadErrorMessage = computed(() => {
  const statusMessage = error.value?.data?.statusMessage || error.value?.statusMessage
  return statusMessage || 'Não foi possível carregar as aulas. Tente novamente.'
})

function openLesson(lesson) {
  activeLesson.value = lesson
}

function closeLesson() {
  activeLesson.value = null
}
</script>

<template>
  <div class="mx-auto w-full max-w-[960px] px-4 py-6 sm:px-6 sm:py-8">

    <!-- CABEÇALHO -->
    <section class="mb-6">
      <h1 class="text-2xl font-black tracking-tight text-[var(--student-text)] sm:text-3xl">
        Aulas
      </h1>
      <p class="mt-1 text-sm text-[var(--student-text-secondary)]">
        Conteúdos organizados por matéria e módulo para sua preparação.
      </p>
    </section>

    <!-- BARRA DE BUSCA -->
    <div class="relative mb-5">
      <span class="material-symbols-rounded absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-[var(--student-text-muted)]">
        search
      </span>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Buscar aulas..."
        class="h-12 w-full rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] pl-11 pr-4 text-sm text-[var(--student-text)] placeholder-[var(--student-text-muted)] outline-none transition focus:border-[var(--student-primary-solid)] focus:ring-2 focus:ring-[var(--student-primary-solid)]/20"
      />
    </div>

    <!-- FILTRO POR MATÉRIA (tabs horizontais) -->
    <div class="mb-6 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
      <button
        type="button"
        class="flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition"
        :class="
          selectedSubjectId === null
            ? 'bg-[var(--student-primary-solid)] text-white shadow-sm'
            : 'border border-[var(--student-border)] bg-[var(--student-card)] text-[var(--student-text-secondary)] hover:border-[var(--student-primary-solid)] hover:text-[var(--student-primary-text)]'
        "
        @click="selectedSubjectId = null"
      >
        Todas
      </button>

      <button
        v-for="subject in filterSubjects"
        :key="subject.id"
        type="button"
        class="flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition"
        :class="
          selectedSubjectId === subject.id
            ? 'bg-[var(--student-primary-solid)] text-white shadow-sm'
            : 'border border-[var(--student-border)] bg-[var(--student-card)] text-[var(--student-text-secondary)] hover:border-[var(--student-primary-solid)] hover:text-[var(--student-primary-text)]'
        "
        @click="selectedSubjectId = subject.id"
      >
        {{ subject.name }}
      </button>
    </div>

    <!-- CARREGANDO -->
    <div v-if="pending" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="animate-pulse rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] p-5"
      >
        <div class="h-5 w-1/3 rounded-lg bg-[var(--student-surface-secondary)]"></div>
        <div class="mt-3 space-y-2">
          <div class="h-14 rounded-xl bg-[var(--student-surface-secondary)]"></div>
          <div class="h-14 rounded-xl bg-[var(--student-surface-secondary)]"></div>
        </div>
      </div>
    </div>

    <!-- ERRO -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
    >
      <span class="material-symbols-rounded text-4xl text-red-400">error</span>
      <p class="mt-2 text-sm font-semibold text-red-600">
        {{ loadErrorMessage }}
      </p>
      <button
        type="button"
        class="mt-4 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
        @click="refresh()"
      >
        Tentar novamente
      </button>
    </div>

    <!-- VAZIO -->
    <div
      v-else-if="!pending && subjects.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <span class="material-symbols-rounded text-6xl text-[var(--student-text-muted)]">school</span>
      <p class="mt-3 text-base font-bold text-[var(--student-text)]">
        Nenhuma aula encontrada
      </p>
      <p class="mt-1 text-sm text-[var(--student-text-secondary)]">
        {{ searchQuery ? 'Tente outro termo de busca.' : 'Em breve novos conteúdos serão adicionados.' }}
      </p>
    </div>

    <!-- LISTA DE MATÉRIAS E MÓDULOS -->
    <div v-else class="space-y-5">
      <div
        v-for="subject in subjects"
        :key="subject.id"
      >
        <!-- CABEÇALHO DA MATÉRIA -->
        <div class="mb-3 flex items-center gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--student-primary-soft)]">
            <span class="material-symbols-rounded text-lg text-[var(--student-primary-text)]">menu_book</span>
          </div>
          <div>
            <h2 class="text-base font-black text-[var(--student-text)]">
              {{ subject.name }}
            </h2>
            <p class="text-xs text-[var(--student-text-muted)]">
              {{ countLessons(subject) }} aula{{ countLessons(subject) !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>

        <!-- MÓDULOS DA MATÉRIA -->
        <div class="space-y-2.5 pl-0 sm:pl-2">
          <!-- Sem módulos / aulas -->
          <div
            v-if="subject.modules.length === 0 || subject.modules.every(m => m.lessons.length === 0)"
            class="rounded-xl border border-dashed border-[var(--student-border)] p-4 text-center text-xs text-[var(--student-text-muted)]"
          >
            Nenhuma aula disponível nesta matéria.
          </div>

          <template v-for="mod in subject.modules" :key="mod.id">
            <div
              v-if="mod.lessons.length > 0"
              class="overflow-hidden rounded-2xl border border-[var(--student-border)] bg-[var(--student-card)] transition"
            >
            <!-- CABEÇALHO DO MÓDULO (clicável para expandir) -->
            <button
              type="button"
              class="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-[var(--student-surface-secondary)]"
              @click="toggleModule(mod.id)"
            >
              <div class="min-w-0">
                <h3 class="truncate text-sm font-bold text-[var(--student-text)]">
                  {{ mod.name }}
                </h3>
                <p v-if="mod.description" class="mt-0.5 truncate text-xs text-[var(--student-text-muted)]">
                  {{ mod.description }}
                </p>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <span class="rounded-full bg-[var(--student-primary-soft)] px-2.5 py-0.5 text-xs font-black text-[var(--student-primary-text)]">
                  {{ mod.lessons.length }}
                </span>
                <span
                  class="material-symbols-rounded text-xl text-[var(--student-text-muted)] transition-transform duration-200"
                  :class="expandedModules.has(mod.id) ? 'rotate-180' : ''"
                >
                  expand_more
                </span>
              </div>
            </button>

            <!-- LISTA DE AULAS (expansível) -->
            <Transition
              name="expand"
              @enter="el => { el.style.maxHeight = el.scrollHeight + 'px' }"
              @leave="el => { el.style.maxHeight = '0px' }"
            >
              <div
                v-if="expandedModules.has(mod.id)"
                class="divide-y divide-[var(--student-border)] border-t border-[var(--student-border)]"
              >
                <button
                  v-for="lesson in mod.lessons"
                  :key="lesson.id"
                  type="button"
                  class="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[var(--student-primary-soft)]"
                  @click="openLesson(lesson)"
                >
                  <!-- THUMBNAIL OU ÍCONE -->
                  <div class="relative shrink-0">
                    <img
                      v-if="getVideoThumbnail(lesson.videoUrl)"
                      :src="getVideoThumbnail(lesson.videoUrl)"
                      :alt="lesson.title"
                      class="h-14 w-24 rounded-xl object-cover"
                    />
                    <div
                      v-else
                      class="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--student-surface-secondary)]"
                    >
                      <span class="material-symbols-rounded text-2xl text-[var(--student-text-muted)]">play_circle</span>
                    </div>

                    <!-- OVERLAY DE PLAY -->
                    <div class="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30 opacity-0 transition group-hover:opacity-100">
                      <span class="material-symbols-rounded text-3xl text-white">play_circle</span>
                    </div>
                  </div>

                  <!-- TÍTULO E DESCRIÇÃO -->
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-bold text-[var(--student-text)] transition group-hover:text-[var(--student-primary-text)]">
                      {{ lesson.title }}
                    </p>
                    <p v-if="lesson.description" class="mt-0.5 line-clamp-2 text-xs text-[var(--student-text-secondary)]">
                      {{ lesson.description }}
                    </p>
                  </div>

                  <!-- SETA -->
                  <span class="material-symbols-rounded shrink-0 text-xl text-[var(--student-text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--student-primary-text)]">
                    chevron_right
                  </span>
                </button>
              </div>
            </Transition>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL DE VÍDEO -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="activeLesson"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeLesson"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeLesson"></div>

        <div class="relative z-10 w-full max-w-3xl rounded-3xl bg-[var(--student-card)] shadow-2xl">
          <!-- CABEÇALHO DO MODAL -->
          <div class="flex items-start justify-between gap-4 border-b border-[var(--student-border)] p-5">
            <div class="min-w-0">
              <h3 class="text-base font-black text-[var(--student-text)]">
                {{ activeLesson.title }}
              </h3>
              <p v-if="activeLesson.description" class="mt-1 text-xs text-[var(--student-text-secondary)] line-clamp-2">
                {{ activeLesson.description }}
              </p>
            </div>

            <button
              type="button"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--student-border)] text-[var(--student-text-secondary)] transition hover:bg-red-50 hover:text-red-500"
              @click="closeLesson"
            >
              <span class="material-symbols-rounded text-xl">close</span>
            </button>
          </div>

          <!-- PLAYER DE VÍDEO -->
          <div class="p-5">
            <div
              v-if="getYoutubeId(activeLesson.videoUrl)"
              class="aspect-video w-full overflow-hidden rounded-2xl bg-black"
            >
              <iframe
                :src="`https://www.youtube.com/embed/${getYoutubeId(activeLesson.videoUrl)}?autoplay=1&rel=0`"
                :title="activeLesson.title"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="h-full w-full border-0"
              ></iframe>
            </div>

            <!-- Sem vídeo -->
            <div
              v-else-if="activeLesson.videoUrl"
              class="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-[var(--student-border)] bg-[var(--student-surface-secondary)] text-center p-6"
            >
              <span class="material-symbols-rounded text-5xl text-[var(--student-text-muted)]">video_library</span>
              <p class="mt-3 text-sm font-bold text-[var(--student-text)]">Aula disponível externamente</p>
              <a
                :href="activeLesson.videoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--student-primary-solid)] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                <span class="material-symbols-rounded text-sm">open_in_new</span>
                Abrir vídeo
              </a>
            </div>

            <div
              v-else
              class="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--student-border)] text-center"
            >
              <span class="material-symbols-rounded text-5xl text-[var(--student-text-muted)]">videocam_off</span>
              <p class="mt-3 text-sm text-[var(--student-text-muted)]">Vídeo ainda não disponível para esta aula.</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  overflow: hidden;
  opacity: 1;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0 !important;
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
