<script setup>

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

</script>


<template>

<div class="space-y-6">


<div>

<h1 class="text-3xl font-black text-zinc-900">
Dashboard
</h1>

<p class="mt-2 text-zinc-500">
Bem-vindo ao painel administrativo do Conectar ENEM.
</p>

</div>


<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">


<div class="rounded-2xl border border-zinc-200 bg-white p-6">

<p class="text-sm text-zinc-500">
Matérias
</p>

<p class="mt-2 text-3xl font-black">
0
</p>

</div>


<div class="rounded-2xl border border-zinc-200 bg-white p-6">

<p class="text-sm text-zinc-500">
Módulos
</p>

<p class="mt-2 text-3xl font-black">
0
</p>

</div>


<div class="rounded-2xl border border-zinc-200 bg-white p-6">

<p class="text-sm text-zinc-500">
Aulas
</p>

<p class="mt-2 text-3xl font-black">
0
</p>

</div>


<div class="rounded-2xl border border-zinc-200 bg-white p-6">

<p class="text-sm text-zinc-500">
Questões
</p>

<p class="mt-2 text-3xl font-black">
0
</p>

</div>


</div>


</div>

</template>