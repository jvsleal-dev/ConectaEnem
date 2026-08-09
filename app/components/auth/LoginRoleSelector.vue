<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

function selectRole(role) {
  emit('update:modelValue', role)
}
</script>

<template>
  <div
    class="relative grid grid-cols-2 rounded-xl bg-purple-50 p-1"
  >
    <div
      class="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-lg bg-[var(--color-primary)] shadow-sm transition-transform duration-300 ease-out"
      :class="{
        'translate-x-full': modelValue === 'TEACHER'
      }"
    />

    <button
      type="button"
      class="relative z-10 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors duration-300"
      :class="
        modelValue === 'STUDENT'
          ? 'text-white'
          : 'text-zinc-500 hover:text-[var(--color-primary)]'
      "
      @click="selectRole('STUDENT')"
    >
      Aluno
    </button>

    <button
      type="button"
      class="relative z-10 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors duration-300"
      :class="
        modelValue === 'TEACHER'
          ? 'text-white'
          : 'text-zinc-500 hover:text-[var(--color-primary)]'
      "
      @click="selectRole('TEACHER')"
    >
      Professor
    </button>
  </div>
</template>