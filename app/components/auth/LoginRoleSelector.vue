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
    class="relative grid grid-cols-2 rounded-xl bg-zinc-900 border border-zinc-800 p-1"
  >
    <div
      class="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-lg bg-purple-600 shadow-sm transition-transform duration-300 ease-out"
      :class="{
        'translate-x-full': modelValue === 'TEACHER'
      }"
    />

    <button
      type="button"
      class="relative z-10 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors duration-300 cursor-pointer"
      :class="
        modelValue === 'STUDENT'
          ? 'text-white'
          : 'text-zinc-400 hover:text-white'
      "
      @click="selectRole('STUDENT')"
    >
      Aluno
    </button>

    <button
      type="button"
      class="relative z-10 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors duration-300 cursor-pointer"
      :class="
        modelValue === 'TEACHER'
          ? 'text-white'
          : 'text-zinc-400 hover:text-white'
      "
      @click="selectRole('TEACHER')"
    >
      Professor
    </button>
  </div>
</template>