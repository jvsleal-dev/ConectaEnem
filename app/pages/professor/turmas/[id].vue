<script setup>
import { useTeacherClassrooms } from '~/composables/useTeacherClassrooms'

definePageMeta({
  layout: 'professor',
  middleware: 'teacher'
})

const route = useRoute()
const classroomId = computed(() => route.params.id)

const { getClassroom, removeStudent } = useTeacherClassrooms()

const loading = ref(true)
const classroom = ref(null)
const removingStudentId = ref(null)
const toastMessage = ref('')
const toastType = ref('success')
const copied = ref(false)

useSeoMeta({
  title: () => `${classroom.value?.name || 'Turma'} — Painel do Professor`
})

function showToast(msg, type = 'success') {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const inviteLink = computed(() => {
  if (!classroom.value?.inviteToken) return ''
  if (import.meta.client) {
    return `${window.location.origin}/convite/${classroom.value.inviteToken}`
  }
  return `/convite/${classroom.value.inviteToken}`
})

async function copyLink() {
  if (import.meta.client && navigator.clipboard && inviteLink.value) {
    await navigator.clipboard.writeText(inviteLink.value)
    copied.value = true
    showToast('Link de convite copiado!', 'success')
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

async function loadData() {
  loading.value = true
  try {
    const res = await getClassroom(classroomId.value)
    if (res?.classroom) {
      classroom.value = res.classroom
    }
  } catch (err) {
    showToast('Erro ao carregar detalhes da turma.', 'error')
  } finally {
    loading.value = false
  }
}

async function handleRemoveStudent(student) {
  const confirmed = confirm(`Deseja desvincular o aluno "${student.name}" desta turma?`)
  if (!confirmed) return

  removingStudentId.value = student.id
  try {
    await removeStudent(classroomId.value, student.id)
    showToast('Aluno removido da turma.', 'success')
    await loadData()
  } catch (err) {
    showToast(err.data?.message || 'Erro ao remover aluno.', 'error')
  } finally {
    removingStudentId.value = null
  }
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Toast Feedback -->
    <Transition name="fade">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold text-white shadow-xl transition-all"
        :class="toastType === 'error' ? 'bg-red-600' : 'bg-emerald-600'"
      >
        <span class="material-symbols-rounded text-base">
          {{ toastType === 'error' ? 'error' : 'check_circle' }}
        </span>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Top Navigation Breadcrumb -->
    <div>
      <NuxtLink
        to="/professor"
        class="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 transition mb-3"
      >
        <span class="material-symbols-rounded text-sm">arrow_back</span>
        <span>Voltar para Turmas</span>
      </NuxtLink>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="loading" class="space-y-6 animate-pulse">
      <div class="h-32 rounded-3xl bg-slate-200"></div>
      <div class="h-64 rounded-3xl bg-slate-100"></div>
    </div>

    <template v-else-if="classroom">
      <!-- Cabeçalho da Turma -->
      <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-black text-purple-700">
                Código: {{ classroom.code }}
              </span>
              <span
                v-if="classroom.isExpired"
                class="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700"
              >
                Expirado
              </span>
              <span
                v-else
                class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700"
              >
                Ativo
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {{ classroom.name }}
            </h1>
            <p v-if="classroom.description" class="mt-2 text-sm text-slate-600 max-w-2xl">
              {{ classroom.description }}
            </p>
          </div>

          <!-- Convite Box -->
          <div class="w-full md:w-80 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Link de Inscrição</p>
            <div class="flex items-center gap-2">
              <input
                type="text"
                readonly
                :value="inviteLink"
                class="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 font-mono outline-none truncate"
              />
              <button
                type="button"
                @click="copyLink"
                class="shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition"
                :class="copied ? 'bg-emerald-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'"
              >
                {{ copied ? 'Copiado' : 'Copiar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Meta Infos -->
        <div class="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span class="text-slate-400 font-medium">Total de Inscritos</span>
            <p class="text-base font-black text-slate-900 mt-0.5">
              {{ classroom.studentsCount }}
              <span v-if="classroom.maxStudents" class="text-slate-400 font-normal text-xs">/ {{ classroom.maxStudents }} max</span>
            </p>
          </div>
          <div>
            <span class="text-slate-400 font-medium">Validade do Convite</span>
            <p class="text-xs font-bold text-slate-800 mt-1">
              {{ classroom.expiresAt ? formatDate(classroom.expiresAt) : 'Sem data limite (Perpétuo)' }}
            </p>
          </div>
          <div>
            <span class="text-slate-400 font-medium">Criada em</span>
            <p class="text-xs font-bold text-slate-800 mt-1">
              {{ formatDate(classroom.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Lista de Alunos Inscritos -->
      <div class="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-base font-black text-slate-900">Alunos Matriculados</h2>
            <p class="text-xs text-slate-500">Lista dos alunos que entraram através do seu link de convite.</p>
          </div>
          <span class="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
            {{ classroom.members?.length || 0 }} aluno(s)
          </span>
        </div>

        <!-- Estado vazio -->
        <div v-if="!classroom.members || classroom.members.length === 0" class="p-12 text-center">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <span class="material-symbols-rounded text-2xl">person_search</span>
          </div>
          <h3 class="text-sm font-bold text-slate-700">Nenhum aluno inscrito ainda</h3>
          <p class="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Compartilhe o link de convite com seus estudantes para que eles possam ingressar nesta turma.
          </p>
          <button
            type="button"
            @click="copyLink"
            class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition"
          >
            <span class="material-symbols-rounded text-sm">content_copy</span>
            <span>Copiar Link de Convite</span>
          </button>
        </div>

        <!-- Tabela de Alunos -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th class="py-3.5 px-6">Aluno</th>
                <th class="py-3.5 px-6">Email</th>
                <th class="py-3.5 px-6">Data de Ingresso</th>
                <th class="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="member in classroom.members"
                :key="member.id"
                class="hover:bg-slate-50/75 transition"
              >
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 font-black text-purple-700 text-xs">
                      {{ (member.student?.name || 'A').slice(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 text-sm">{{ member.student?.name }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 text-slate-600 font-medium">
                  {{ member.student?.email }}
                </td>
                <td class="py-4 px-6 text-slate-500">
                  {{ formatDate(member.joinedAt) }}
                </td>
                <td class="py-4 px-6 text-right">
                  <button
                    type="button"
                    :disabled="removingStudentId === member.student?.id"
                    @click="handleRemoveStudent(member.student)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold transition disabled:opacity-50"
                  >
                    <span class="material-symbols-rounded text-sm">person_remove</span>
                    <span>Remover</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
