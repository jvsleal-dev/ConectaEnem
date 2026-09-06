<script setup>
import { useSubjects } from '~/composables/useSubjects'

const { getSubjects } = useSubjects()
const subjects = ref([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const res = await getSubjects()
    subjects.value = res?.subjects || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-zinc-900">Matérias</h1>
        <p class="mt-1 text-sm text-zinc-500">Cadastre e gerencie as matérias da plataforma.</p>
      </div>

      <NuxtLink
        to="/admin/materias/nova"
        class="inline-flex rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700"
      >
        + Nova matéria
      </NuxtLink>
    </div>

    <div v-if="loading" class="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
      Carregando matérias...
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="sub in subjects"
        :key="sub.id"
        class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs"
      >
        <h3 class="font-bold text-zinc-900">{{ sub.name }}</h3>
        <p class="mt-1 text-xs text-zinc-500">{{ sub.description || "Sem descrição" }}</p>
        <div class="mt-4 flex justify-end">
          <NuxtLink
            :to="`/admin/materias/${sub.id}`"
            class="text-xs font-bold text-purple-600 hover:underline"
          >
            Gerenciar matéria →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
