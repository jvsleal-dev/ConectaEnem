<script setup>
const props = defineProps({
  classroom: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'delete', 'copy-link'])

const copied = ref(false)

const inviteLink = computed(() => {
  if (import.meta.client) {
    return `${window.location.origin}/convite/${props.classroom.inviteToken}`
  }
  return `/convite/${props.classroom.inviteToken}`
})

async function copyLink() {
  if (import.meta.client && navigator.clipboard) {
    await navigator.clipboard.writeText(inviteLink.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
    emit('copy-link', inviteLink.value)
  }
}

function formatDate(d) {
  if (!d) return null
  return new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="group relative rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
    <div>
      <!-- Status Badges -->
      <div class="flex items-center justify-between gap-2 mb-3">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 text-[11px] font-black text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/40">
          <span class="material-symbols-rounded text-xs">pin</span>
          Código: {{ classroom.code }}
        </span>

        <div class="flex items-center gap-1.5">
          <span
            v-if="classroom.isExpired"
            class="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40"
          >
            <span class="material-symbols-rounded text-xs">timer_off</span>
            Expirado
          </span>
          <span
            v-else-if="classroom.isFull"
            class="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40"
          >
            <span class="material-symbols-rounded text-xs">group_off</span>
            Lotada
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Link Ativo
          </span>
        </div>
      </div>

      <!-- Nome e Descrição -->
      <h3 class="text-base font-black text-slate-900 dark:text-zinc-100 leading-snug group-hover:text-purple-700 dark:group-hover:text-purple-400 transition">
        {{ classroom.name }}
      </h3>
      <p v-if="classroom.description" class="mt-1 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
        {{ classroom.description }}
      </p>

      <!-- Infos de Limite e Validade -->
      <div class="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 p-3 text-xs border border-slate-100 dark:border-zinc-800">
        <div>
          <p class="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Alunos</p>
          <p class="mt-0.5 font-black text-slate-800 dark:text-zinc-200 flex items-center gap-1">
            <span class="material-symbols-rounded text-sm text-purple-600 dark:text-purple-400">groups</span>
            {{ classroom.studentsCount }}
            <span v-if="classroom.maxStudents" class="text-slate-400 dark:text-zinc-500 font-normal">/ {{ classroom.maxStudents }}</span>
            <span v-else class="text-[10px] text-slate-400 dark:text-zinc-500 font-normal">(sem limite)</span>
          </p>
        </div>

        <div>
          <p class="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Validade</p>
          <p class="mt-0.5 font-bold text-slate-800 dark:text-zinc-200 text-[11px] truncate flex items-center gap-1" :title="formatDate(classroom.expiresAt) || 'Sem expiração'">
            <span class="material-symbols-rounded text-sm text-purple-600 dark:text-purple-400">event</span>
            {{ classroom.expiresAt ? formatDate(classroom.expiresAt) : 'Perpétuo' }}
          </p>
        </div>
      </div>

      <!-- Link de Convite Compartilhar -->
      <div class="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2">
        <span class="material-symbols-rounded text-base text-slate-400 dark:text-zinc-500 shrink-0">link</span>
        <input
          type="text"
          readonly
          :value="inviteLink"
          class="w-full bg-transparent text-[11px] text-slate-500 dark:text-zinc-400 font-mono outline-none truncate"
        />
        <button
          type="button"
          @click="copyLink"
          class="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer"
          :class="copied ? 'bg-emerald-600 text-white' : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60'"
        >
          <span class="material-symbols-rounded text-xs">{{ copied ? 'check' : 'content_copy' }}</span>
          {{ copied ? 'Copiado!' : 'Copiar' }}
        </button>
      </div>
    </div>

    <!-- Ações do Card -->
    <div class="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-4">
      <NuxtLink
        :to="`/professor/turmas/${classroom.id}`"
        class="inline-flex items-center gap-1.5 text-xs font-black text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 transition"
      >
        <span>Gerenciar Alunos</span>
        <span class="material-symbols-rounded text-sm">arrow_forward</span>
      </NuxtLink>

      <button
        type="button"
        class="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
        title="Excluir Turma"
        @click="emit('delete', classroom)"
      >
        <span class="material-symbols-rounded text-base">delete</span>
      </button>
    </div>
  </div>
</template>
