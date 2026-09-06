<script setup>
const {
  theme,
  toggleTheme
} = useTheme()

const buttonLabel = computed(() => {
  return theme.value === 'dark'
    ? 'Ativar modo claro'
    : 'Ativar modo escuro'
})
</script>


<template>
  <button
    type="button"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    class="
      flex
      h-11
      w-11
      shrink-0
      items-center
      justify-center
      rounded-xl
      border
      border-[var(--student-border)]
      bg-[var(--student-surface)]
      text-[var(--student-primary-text)]
      transition
      hover:bg-[var(--student-primary-soft)]
      focus:outline-none
      focus:ring-2
      focus:ring-[var(--student-primary)]
    "
    @click="toggleTheme"
  >
    <Icon
      :name="
        theme === 'dark'
          ? 'material-symbols:light-mode-rounded'
          : 'material-symbols:dark-mode-rounded'
      "
      class="text-[22px]"
    />
  </button>
</template>