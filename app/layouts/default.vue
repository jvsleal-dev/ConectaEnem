<script setup>
import { useTheme } from '~/composables/useTheme'

const { theme, isDark } = useTheme()
</script>

<template>
  <div
    class="min-h-screen bg-white text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100"
    :data-theme="theme"
    :class="{ dark: isDark }"
  >
    <slot />
  </div>
</template>