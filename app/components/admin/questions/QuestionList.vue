<!-- app/components/admin/questions/QuestionList.vue -->
<script setup>
defineProps({
  questions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'view',
  'edit',
  'delete'
])
</script>

<template>
  <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
    <QuestionCard
      v-for="question in questions"
      :key="question.id"
      :question="question"
      @view="emit('view', question)"
      @edit="emit('edit', question)"
      @delete="emit('delete', question)"
    />
  </div>
</template>