<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },

  value: {
    type: [
      String,
      Number
    ],
    required: true
  },

  helper: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    required: true
  }
})
</script>


<template>
  <article
    class="
      student-card
      rounded-2xl
      p-5
    "
  >
    <div
      class="
        flex
        items-start
        justify-between
        gap-4
      "
    >
      <div
        class="
          student-icon-tile
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
        "
      >
        <Icon
          :name="icon"
          class="text-[22px]"
        />
      </div>
    </div>

    <p
      class="
        mt-5
        text-2xl
        font-black
        tracking-tight
        text-[var(--student-text)]
      "
    >
      {{ value }}
    </p>

    <p
      class="
        mt-1
        text-sm
        font-bold
        text-[var(--student-text)]
      "
    >
      {{ label }}
    </p>

    <p
      v-if="helper"
      class="
        mt-2
        text-xs
        leading-5
        text-[var(--student-text-secondary)]
      "
    >
      {{ helper }}
    </p>
  </article>
</template>