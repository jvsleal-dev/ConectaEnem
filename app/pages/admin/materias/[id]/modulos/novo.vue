<script setup>

import { useModules } from '~/composables/useModules'
import { useSubjects } from '~/composables/useSubjects'


definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})


const route = useRoute()


const {
  getSubject
} = useSubjects()


const {
  createModule
} = useModules()



const subject = ref(null)

const loading = ref(true)

const saving = ref(false)

const error = ref('')


const form = reactive({

  name: '',

  description: '',

  order: 1,

  active: true

})



async function loadSubject(){

  try {

    const response =
      await getSubject(
        route.params.id
      )


    subject.value =
      response.subject

  }

  catch(err){

    console.error(
      err
    )

    error.value =
      'Erro ao carregar matéria.'

  }

  finally{

    loading.value = false

  }

}





async function saveModule(){

  if(saving.value){
    return
  }


  saving.value = true

  error.value = ''


  try {


    await createModule({

      subjectId:
        route.params.id,


      name:
        form.name,


      description:
        form.description,


      order:
        form.order,


      active:
        form.active

    })


    await navigateTo(
      `/admin/materias/${route.params.id}`
    )


  }

  catch(err){

    console.error(
      err
    )


    error.value =
      err?.data?.statusMessage ||
      'Erro ao criar módulo.'

  }


  finally{

    saving.value = false

  }

}



onMounted(() => {

  loadSubject()

})

</script>


<template>

<div class="space-y-6">


<NuxtLink
:to="`/admin/materias/${route.params.id}`"
class="text-sm font-bold text-purple-600"
>
← Voltar para {{ subject?.name }}
</NuxtLink>



<div
v-if="loading"
class="rounded-xl bg-white p-8 text-center"
>
Carregando...
</div>




<div
v-else
class="space-y-6"
>


<div>

<p
class="text-sm font-bold text-purple-600"
>
{{ subject?.name }}
</p>


<h1
class="text-3xl font-black text-zinc-900"
>
Novo módulo
</h1>


<p
class="mt-2 text-zinc-500"
>
Cadastre um módulo dentro desta matéria.
</p>


</div>




<div
v-if="error"
class="rounded-xl bg-red-50 p-4 text-red-600"
>
{{ error }}
</div>





<form
@submit.prevent="saveModule"
class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"
>




<div>

<label
class="font-bold text-zinc-700"
>
Nome do módulo
</label>


<input

v-model="form.name"

required

class="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3"

placeholder="Ex: Operações básicas"

>

</div>





<div>

<label
class="font-bold text-zinc-700"
>
Descrição
</label>


<textarea

v-model="form.description"

rows="4"

class="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3"

placeholder="Descrição do módulo"

></textarea>


</div>





<div>

<label
class="font-bold text-zinc-700"
>
Ordem do módulo
</label>


<input

v-model.number="form.order"

type="number"

min="1"

class="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3"

>

</div>





<div
class="rounded-xl border border-zinc-200 p-4"
>


<p
class="font-bold text-zinc-700"
>
Status
</p>


<label
class="mt-3 flex items-center gap-3"
>

<input

v-model="form.active"

type="checkbox"

class="h-4 w-4"

>


<span>

Módulo ativo

</span>


</label>


</div>






<button

type="submit"

:disabled="saving"

class="rounded-xl bg-purple-600 px-6 py-3 font-bold text-white disabled:opacity-50"

>

{{
saving
?
'Salvando...'
:
'Criar módulo'
}}

</button>





</form>



</div>


</div>


</template>