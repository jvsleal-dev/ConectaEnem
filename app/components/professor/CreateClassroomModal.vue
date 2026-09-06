<script setup>
const props = defineProps({
  show: Boolean,
  loading: Boolean
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  name: '',
  description: '',
  maxStudents: '',
  expiresAt: ''
})

const errors = ref({})

function reset() {
  form.name = ''
  form.description = ''
  form.maxStudents = ''
  form.expiresAt = ''
  errors.value = {}
}

function handleClose() {
  reset()
  emit('close')
}

function handleSubmit() {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Nome da turma é obrigatório.'
    return
  }

  emit('save', {
    name: form.name.trim(),
    description: form.description.trim() || null,
    maxStudents: form.maxStudents ? parseInt(form.maxStudents, 10) : null,
    expiresAt: form.expiresAt || null
  })
}

// Data mínima para validade: hoje
const minDate = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" @click="handleClose"></div>

        <!-- Modal Box -->
        <div class="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl z-10">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <span class="material-symbols-rounded text-xl">group_add</span>
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900 leading-tight">Criar Nova Turma</h3>
                <p class="text-xs text-slate-500">Configure os limites e validade do convite</p>
              </div>
            </div>
            <button
              type="button"
              class="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              @click="handleClose"
            >
              <span class="material-symbols-rounded text-lg">close</span>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Nome -->
            <div>
              <label class="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Nome da Turma <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Ex: Redação ENEM 2026 - Intensivo"
                class="h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                :class="errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500 font-semibold">{{ errors.name }}</p>
            </div>

            <!-- Descrição -->
            <div>
              <label class="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Descrição ou Avisos (Opcional)
              </label>
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="Ex: Turma focada em competência 2 e 3 com correções semanais."
                class="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              ></textarea>
            </div>

            <!-- Limite e Validade Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Limite de Pessoas -->
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                  <span class="material-symbols-rounded text-sm text-purple-600">person_add</span>
                  Máximo de Alunos
                </label>
                <input
                  v-model="form.maxStudents"
                  type="number"
                  min="1"
                  placeholder="Ilimitado"
                  class="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                />
                <p class="mt-1 text-[11px] text-slate-400">Deixe em branco para sem limite</p>
              </div>

              <!-- Data de Validade -->
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                  <span class="material-symbols-rounded text-sm text-purple-600">event</span>
                  Validade do Link
                </label>
                <input
                  v-model="form.expiresAt"
                  type="datetime-local"
                  :min="minDate"
                  class="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                />
                <p class="mt-1 text-[11px] text-slate-400">Deixe em branco para link perpétuo</p>
              </div>
            </div>

            <!-- Botões de Ação -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                @click="handleClose"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-black text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition disabled:opacity-50"
              >
                <span v-if="loading" class="material-symbols-rounded animate-spin text-sm">progress_activity</span>
                <span>{{ loading ? 'Criando Turma...' : 'Criar Turma' }}</span>
              </button>
            </div>
          </form>
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
