<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },

  to: {
    type: String,
    required: true
  },

  icon: {
    type: String,
    default: ''
  },

  exact: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

const isActive = computed(() => {
  if (props.exact) {
    return route.path === props.to
  }

  return (
    route.path === props.to ||
    route.path.startsWith(`${props.to}/`)
  )
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition"
    :class="
      isActive
        ? 'bg-purple-50 text-[var(--color-primary)]'
        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
    "
  >
    <span
      v-if="icon"
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition"
      :class="
        isActive
          ? 'bg-white text-[var(--color-primary)] shadow-sm'
          : 'bg-zinc-100 text-zinc-500 group-hover:bg-white'
      "
    >
      {{ icon }}
    </span>

    <span class="truncate">
      {{ label }}
    </span>
  </NuxtLink>
</template>