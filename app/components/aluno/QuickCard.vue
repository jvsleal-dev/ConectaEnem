<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ''
  },

  value: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    required: true
  },

  route: {
    type: String,
    required: true
  }
})
</script>


<template>
  <NuxtLink
    :to="route"
    class="
      student-card
      student-card-interactive
      group
      flex
      min-h-[168px]
      flex-col
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
          h-11
          w-11
          rounded-xl
        "
      >
        <Icon
          :name="icon"
          class="text-[24px]"
        />
      </div>

      <Icon
        name="
          material-symbols:
          arrow-outward-rounded
        "
        class="
          text-xl
          text-[var(--student-text-muted)]
          transition
          group-hover:text-[var(--student-primary-text)]
        "
      />
    </div>

    <div class="mt-auto pt-6">
      <div
        class="
          flex
          items-end
          justify-between
          gap-3
        "
      >
        <h3
          class="
            text-base
            font-black
            text-[var(--student-text)]
          "
        >
          {{ title }}
        </h3>

        <span
          v-if="value"
          class="
            shrink-0
            text-xs
            font-bold
            text-[var(--student-primary-text)]
          "
        >
          {{ value }}
        </span>
      </div>

      <p
        v-if="description"
        class="
          mt-2
          text-sm
          leading-5
          text-[var(--student-text-secondary)]
        "
      >
        {{ description }}
      </p>
    </div>
  </NuxtLink>
</template>