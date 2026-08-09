<script setup>
const props = defineProps({
  role: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit'])

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const isTeacher = computed(() => {
  return props.role === 'TEACHER'
})

const title = computed(() => {
  return isTeacher.value
    ? 'Acesso do professor'
    : 'Entre na sua conta'
})

const description = computed(() => {
  return isTeacher.value
    ? 'Acesse sua área para acompanhar alunos e corrigir redações.'
    : 'Continue sua preparação para o ENEM.'
})

function handleSubmit() {
  emit('submit', {
    email: email.value.trim().toLowerCase(),
    password: password.value,
    role: props.role
  })
}
</script>

<template>
  <form
    class="space-y-5"
    @submit.prevent="handleSubmit"
  >
    <!-- Cabeçalho -->
    <div>
      <div
        v-if="isTeacher"
        class="mb-4 inline-flex rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-[var(--color-primary)]"
      >
        Professor de Redação
      </div>

      <h1
        class="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl"
      >
        {{ title }}
      </h1>

      <p class="mt-2 text-sm leading-6 text-zinc-500">
        {{ description }}
      </p>
    </div>

    <!-- Email -->
    <div class="space-y-2">
      <label
        for="login-email"
        class="text-sm font-semibold text-zinc-700"
      >
        Email
      </label>

      <input
        id="login-email"
        v-model="email"
        type="email"
        autocomplete="email"
        required
        placeholder="seuemail@exemplo.com"
        class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-purple-100"
      >
    </div>

    <!-- Senha -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label
          for="login-password"
          class="text-sm font-semibold text-zinc-700"
        >
          Senha
        </label>

        <NuxtLink
          to="/esqueci-senha"
          class="text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-dark)]"
        >
          Esqueci minha senha
        </NuxtLink>
      </div>

      <div class="relative">
        <input
          id="login-password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
          placeholder="Digite sua senha"
          class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-20 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-purple-100"
        >

        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-500 transition hover:text-[var(--color-primary)]"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>
    </div>

    <!-- Entrar -->
    <button
      type="submit"
      class="w-full rounded-xl bg-[var(--color-primary)] px-5 py-3.5 font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]"
    >
      {{ isTeacher ? 'Entrar como professor' : 'Entrar' }}
    </button>

    <!-- Cadastro aparece SOMENTE para aluno -->
    <template v-if="!isTeacher">
      <div class="relative py-2">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-zinc-200" />
        </div>

        <div class="relative flex justify-center">
          <span class="bg-white px-3 text-xs text-zinc-400">
            Ainda não possui conta?
          </span>
        </div>
      </div>

      <NuxtLink
        to="/cadastro"
        class="block w-full rounded-xl border border-purple-200 bg-white px-5 py-3 text-center font-bold text-[var(--color-primary-dark)] transition hover:border-[var(--color-primary)] hover:bg-purple-50"
      >
        Criar conta
      </NuxtLink>
    </template>
  </form>
</template>