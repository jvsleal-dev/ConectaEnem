<script setup>
import { useQuestions } from '~/composables/useQuestions'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  hideTrigger: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue',
  'deleted',
  'close'
])

const localShow = ref(props.modelValue)
const loading = ref(false)
const errorMessage = ref('')

watch(
  () => props.modelValue,
  (val) => {
    localShow.value = val
    if (val) errorMessage.value = ''
  }
)

const { deleteQuestion } = useQuestions()

function open() {
  localShow.value = true
  errorMessage.value = ''
  emit('update:modelValue', true)
}

function close() {
  localShow.value = false
  errorMessage.value = ''
  emit('update:modelValue', false)
  emit('close')
}

async function remove() {
  loading.value = true
  errorMessage.value = ''

  try {
    await deleteQuestion(props.id)
    emit('deleted', props.id)
    close()
  } catch (error) {
    console.error('Erro ao excluir questão:', error)
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Erro ao excluir questão.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button
      v-if="!hideTrigger"
      type="button"
      class="rounded-xl px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/10"
      @click="open"
    >
      Excluir
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="localShow"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          @click.self="close"
        >
          <div
            class="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl"
          >
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <span class="material-symbols-rounded text-xl">delete</span>
                </div>
                <h2 class="text-lg font-bold text-zinc-900">
                  Excluir questão
                </h2>
              </div>

              <button
                type="button"
                aria-label="Fechar"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                @click="close"
              >
                <span class="material-symbols-rounded text-lg">close</span>
              </button>
            </div>

            <p class="text-sm leading-6 text-zinc-600">
              Tem certeza que deseja excluir esta questão? Essa ação removerá a questão e todas as suas alternativas permanentemente.
            </p>

            <div
              v-if="errorMessage"
              class="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              {{ errorMessage }}
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                class="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                @click="close"
              >
                Cancelar
              </button>

              <button
                type="button"
                :disabled="loading"
                class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                @click="remove"
              >
                <span
                  v-if="loading"
                  class="material-symbols-rounded animate-spin text-sm"
                >
                  progress_activity
                </span>
                {{ loading ? "Excluindo..." : "Sim, excluir" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>