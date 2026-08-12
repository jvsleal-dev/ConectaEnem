<script setup>
import { useSubjects } from '~/composables/useSubjects'
import { useModules } from '~/composables/useModules'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useSeoMeta({
  title: 'Gerenciar matéria — Conectar ENEM'
})

const route = useRoute()

const {
  getSubject
} = useSubjects()

const {
  getModules,
  updateModule,
  deleteModule
} = useModules()

const subject = ref(null)
const modules = ref([])

const loading = ref(true)
const error = ref('')

const updatingId = ref(null)
const deletingId = ref(null)

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [
      subjectResponse,
      modulesResponse
    ] = await Promise.all([
      getSubject(route.params.id),
      getModules(route.params.id)
    ])

    subject.value =
      subjectResponse.subject

    modules.value =
      modulesResponse.modules || []
  }
  catch (err) {
    console.error(
      'Erro ao carregar matéria:',
      err
    )

    error.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      'Não foi possível carregar a matéria.'
  }
  finally {
    loading.value = false
  }
}

async function toggleModule(module) {
  if (updatingId.value) {
    return
  }

  updatingId.value = module.id
  error.value = ''

  try {
    const response = await updateModule(
      module.id,
      {
        subjectId: route.params.id,
        name: module.name,
        description: module.description,
        order: module.order,
        active: !module.active
      }
    )

    const index =
      modules.value.findIndex(
        item => item.id === module.id
      )

    if (index !== -1) {
      modules.value[index] =
        response.module
    }
  }
  catch (err) {
    console.error(
      'Erro ao alterar módulo:',
      err
    )

    error.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      'Não foi possível alterar o módulo.'
  }
  finally {
    updatingId.value = null
  }
}

async function removeModule(module) {
  const confirmed = window.confirm(
    `Deseja realmente excluir o módulo "${module.name}"?`
  )

  if (!confirmed) {
    return
  }

  deletingId.value = module.id
  error.value = ''

  try {
    await deleteModule(module.id)

    modules.value =
      modules.value.filter(
        item => item.id !== module.id
      )
  }
  catch (err) {
    console.error(
      'Erro ao excluir módulo:',
      err
    )

    error.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      'Não foi possível excluir o módulo.'
  }
  finally {
    deletingId.value = null
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">

    <!-- VOLTAR -->
    <NuxtLink
      to="/admin/materias"
      class="inline-flex text-sm font-bold text-[#7C3AED] transition hover:text-[#5B21B6]"
    >
      ← Voltar para matérias
    </NuxtLink>

    <!-- ERRO -->
    <div
      v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
    >
      {{ error }}
    </div>

    <!-- CARREGANDO -->
    <div
      v-if="loading"
      class="rounded-2xl border border-zinc-200 bg-white p-10 text-center"
    >
      <p class="font-semibold text-zinc-500">
        Carregando matéria...
      </p>
    </div>

    <template v-else-if="subject">

      <!-- MATÉRIA -->
      <section
        class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div
          class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <p
              class="text-sm font-bold text-[#7C3AED]"
            >
              Matéria
            </p>

            <h1
              class="mt-1 text-3xl font-black text-zinc-900"
            >
              {{ subject.name }}
            </h1>

            <p
              class="mt-2 text-sm text-zinc-500"
            >
              {{
                subject.description ||
                'Sem descrição'
              }}
            </p>

            <div class="mt-4">
              <span
                class="inline-flex rounded-full px-3 py-1 text-xs font-bold"
                :class="
                  subject.active
                    ? 'bg-green-50 text-green-700'
                    : 'bg-zinc-100 text-zinc-500'
                "
              >
                {{
                  subject.active
                    ? 'Matéria ativa'
                    : 'Matéria inativa'
                }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- MÓDULOS -->
      <section
        class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >

        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2
              class="text-xl font-black text-zinc-900"
            >
              Módulos
            </h2>

            <p
              class="mt-1 text-sm text-zinc-500"
            >
              Gerencie os módulos de {{ subject.name }}.
            </p>
          </div>

          <NuxtLink
            :to="`/admin/materias/${subject.id}/modulos/novo`"
            class="inline-flex items-center justify-center rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5B21B6]"
          >
            + Novo módulo
          </NuxtLink>
        </div>

        <!-- NENHUM MÓDULO -->
        <div
          v-if="modules.length === 0"
          class="mt-6 rounded-xl border border-dashed border-zinc-300 p-10 text-center"
        >
          <div class="text-3xl">
            📦
          </div>

          <h3
            class="mt-4 font-black text-zinc-900"
          >
            Nenhum módulo cadastrado
          </h3>

          <p
            class="mt-2 text-sm text-zinc-500"
          >
            Crie o primeiro módulo desta matéria.
          </p>
        </div>

        <!-- LISTA DE MÓDULOS -->
        <div
          v-else
          class="mt-6 space-y-4"
        >

          <article
            v-for="module in modules"
            :key="module.id"
            class="rounded-2xl border border-zinc-200 p-5"
          >

            <div
              class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
            >

              <!-- INFORMAÇÕES -->
              <div class="min-w-0">

                <div
                  class="flex flex-wrap items-center gap-3"
                >

                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-sm font-black text-[#7C3AED]"
                  >
                    {{ module.order }}
                  </div>

                  <h3
                    class="text-lg font-black text-zinc-900"
                  >
                    {{ module.name }}
                  </h3>

                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-bold"
                    :class="
                      module.active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-zinc-100 text-zinc-500'
                    "
                  >
                    {{
                      module.active
                        ? 'Ativo'
                        : 'Inativo'
                    }}
                  </span>

                </div>

                <p
                  class="mt-3 text-sm text-zinc-500"
                >
                  {{
                    module.description ||
                    'Sem descrição'
                  }}
                </p>

              </div>

              <!-- AÇÕES -->
              <div
                class="flex flex-wrap gap-2"
              >

                <!-- VISUALIZAR -->
                <NuxtLink
                  :to="`/admin/materias/${subject.id}/modulos/${module.id}`"
                  class="rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#5B21B6]"
                >
                  Visualizar
                </NuxtLink>

                <!-- EDITAR -->
                <NuxtLink
                  :to="`/admin/materias/${subject.id}/modulos/${module.id}/editar`"
                  class="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50"
                >
                  Editar
                </NuxtLink>

                <!-- ATIVAR / DESATIVAR -->
                <button
                  type="button"
                  :disabled="
                    updatingId === module.id
                  "
                  class="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  @click="toggleModule(module)"
                >
                  {{
                    updatingId === module.id
                      ? 'Salvando...'
                      : module.active
                        ? 'Desativar'
                        : 'Ativar'
                  }}
                </button>

                <!-- EXCLUIR -->
                <button
                  type="button"
                  :disabled="
                    deletingId === module.id
                  "
                  class="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  @click="removeModule(module)"
                >
                  {{
                    deletingId === module.id
                      ? 'Excluindo...'
                      : 'Excluir'
                  }}
                </button>

              </div>

            </div>

          </article>

        </div>

      </section>

    </template>

  </div>
</template>