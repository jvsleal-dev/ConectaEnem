<script setup>
const props = defineProps({
  lesson: {
    type: Object,
    default: null
  }
})


const destination = computed(() => {
  if (!props.lesson?.id) {
    return '/aluno/aulas'
  }

  return {
    path: '/aluno/aulas',

    query: {
      lesson:
        props.lesson.id
    }
  }
})


const progress = computed(() => {
  const value =
    Number(
      props.lesson?.progress || 0
    )

  return Math.max(
    0,
    Math.min(100, value)
  )
})
</script>


<template>
  <section
    class="
      student-card
      overflow-hidden
      rounded-3xl
    "
  >
    <div
      class="
        flex
        flex-col
        gap-6
        p-6
        sm:p-7
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      <div
        v-if="lesson"
        class="min-w-0 flex-1"
      >
        <div
          class="
            flex
            items-center
            gap-2
          "
        >
          <div
            class="
              student-icon-tile
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
            "
          >
            <Icon
              name="
                material-symbols:
                play-circle-rounded
              "
              class="text-xl"
            />
          </div>

          <p
            class="
              text-xs
              font-black
              uppercase
              tracking-[0.12em]
              text-[var(--student-text-muted)]
            "
          >
            Continue de onde parou
          </p>
        </div>

        <h2
          class="
            mt-5
            truncate
            text-xl
            font-black
            tracking-tight
            text-[var(--student-text)]
            sm:text-2xl
          "
        >
          {{ lesson.title }}
        </h2>

        <p
          class="
            mt-2
            text-sm
            text-[var(--student-text-secondary)]
          "
        >
          <span
            v-if="lesson.subjectName"
          >
            {{ lesson.subjectName }}
          </span>

          <span
            v-if="
              lesson.subjectName &&
              lesson.moduleName
            "
          >
            ·
          </span>

          <span
            v-if="lesson.moduleName"
          >
            {{ lesson.moduleName }}
          </span>
        </p>


        <div class="mt-5 max-w-xl">
          <div
            class="
              mb-2
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <span
              class="
                text-xs
                font-semibold
                text-[var(--student-text-secondary)]
              "
            >
              Progresso da aula
            </span>

            <span
              class="
                text-xs
                font-black
                text-[var(--student-primary-text)]
              "
            >
              {{ progress }}%
            </span>
          </div>

          <div
            class="
              h-2
              overflow-hidden
              rounded-full
              bg-[var(--student-surface-secondary)]
            "
          >
            <div
              class="
                h-full
                rounded-full
                bg-[var(--student-primary-solid)]
                transition-all
                duration-500
              "
              :style="{
                width:
                  `${progress}%`
              }"
            />
          </div>
        </div>
      </div>


      <div
        v-else
        class="min-w-0 flex-1"
      >
        <div
          class="
            student-icon-tile
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
          "
        >
          <Icon
            name="
              material-symbols:
              school-rounded
            "
            class="text-2xl"
          />
        </div>

        <h2
          class="
            mt-4
            text-lg
            font-black
            text-[var(--student-text)]
          "
        >
          Comece sua primeira aula
        </h2>

        <p
          class="
            mt-2
            text-sm
            text-[var(--student-text-secondary)]
          "
        >
          Escolha uma matéria e inicie sua trilha de estudos.
        </p>
      </div>


      <NuxtLink
        :to="destination"
        class="
          student-primary-button
          inline-flex
          shrink-0
          items-center
          justify-center
          gap-2
          self-start
          rounded-xl
          px-5
          py-3
          text-sm
          font-black
          md:self-center
        "
      >
        <Icon
          name="
            material-symbols:
            play-arrow-rounded
          "
          class="text-xl"
        />

        {{
          lesson
            ? 'Continuar aula'
            : 'Ver aulas'
        }}
      </NuxtLink>
    </div>
  </section>
</template>