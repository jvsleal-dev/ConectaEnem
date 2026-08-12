<script setup>
import {
  useModules
} from '~/composables/useModules'


const props = defineProps({
  subjectId: {
    type: String,
    required: true
  }
})


const {
  getModules,
  updateModule
} = useModules()


const modules = ref([])

const loading = ref(true)

const error = ref('')

const updatingId = ref(null)



async function loadModules() {

  loading.value = true

  error.value = ''


  try {

    const response =
      await getModules(
        props.subjectId
      )


    modules.value =
      response.modules || []

  }

  catch (err) {

    console.error(
      'Erro ao carregar módulos:',
      err
    )


    error.value =
      err?.data?.statusMessage ||
      'Erro ao carregar módulos.'

  }

  finally {

    loading.value = false

  }

}



async function toggleModule(module) {

  updatingId.value =
    module.id


  try {

    const response =
      await updateModule(
        module.id,
        {
          subjectId:
            module.subjectId,

          name:
            module.name,

          description:
            module.description,

          order:
            module.order,

          active:
            !module.active
        }
      )


    const index =
      modules.value.findIndex(
        item =>
          item.id === module.id
      )


    if (index !== -1) {

      modules.value[index] =
        response.module

    }


  }

  catch (err) {

    console.error(err)

  }

  finally {

    updatingId.value = null

  }

}



onMounted(() => {

  loadModules()

})

</script>


<template>

  <div class="mt-6">


    <!-- Loading -->

    <div
      v-if="loading"
      class="rounded-xl bg-zinc-50 p-6 text-center text-sm text-zinc-500"
    >

      Carregando módulos...

    </div>



    <!-- Erro -->

    <div
      v-else-if="error"
      class="rounded-xl bg-red-50 p-4 text-sm text-red-600"
    >

      {{ error }}

    </div>



    <!-- Vazio -->

    <div
      v-else-if="modules.length === 0"
      class="rounded-xl border border-dashed border-zinc-300 p-8 text-center"
    >

      <p
        class="font-semibold text-zinc-500"
      >
        Nenhum módulo cadastrado ainda.
      </p>


    </div>




    <!-- Lista -->

    <div
      v-else
      class="space-y-3"
    >


      <div
        v-for="module in modules"
        :key="module.id"
        class="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5"
      >


        <div>


          <p
            class="font-black text-zinc-900"
          >

            {{ module.order }}.
            {{ module.name }}

          </p>



          <p
            class="mt-1 text-sm text-zinc-500"
          >

            {{
              module.description ||
              'Sem descrição'
            }}

          </p>


          <span
            class="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold"
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



        <div
          class="flex gap-2"
        >

          <NuxtLink
            :to="`/admin/materias/${subjectId}/modulos/${module.id}`"
            class="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700"
          >

            Entrar

          </NuxtLink>



          <button
            type="button"
            :disabled="updatingId === module.id"
            class="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700"
            @click="toggleModule(module)"
          >

            {{
              module.active
                ? 'Desativar'
                : 'Ativar'
            }}

          </button>


        </div>


      </div>


    </div>


  </div>

</template>