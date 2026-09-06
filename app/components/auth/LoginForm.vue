<script setup>
import { useAuth } from '~/composables/useAuth'
const props = defineProps({
  isTeacher: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const { login } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const title = computed(() => {
  return props.isTeacher
    ? 'Entrar como professor'
    : 'Entrar na sua conta'
})

const description = computed(() => {
  return props.isTeacher
    ? 'Acesse sua área de professor de redação.'
    : 'Continue sua preparação para o ENEM.'
})

const buttonText = computed(() => {
  if (loading.value) {
    return 'Entrando...'
  }

  return props.isTeacher
    ? 'Entrar como professor'
    : 'Entrar'
})

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    const role = props.isTeacher
      ? 'TEACHER'
      : 'STUDENT'

    await login({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role
    })

    const redirectUrl = route.query.redirect

    if (role === 'TEACHER') {
      await navigateTo(redirectUrl || '/professor')
      return
    }

    await navigateTo(redirectUrl || '/aluno')
  }
  catch (err) {
    const statusCode =
      err?.statusCode ||
      err?.data?.statusCode

    if (statusCode === 401) {
      error.value = 'Email ou senha incorretos.'
      return
    }

    if (statusCode === 403) {
      error.value = props.isTeacher
        ? 'Esta conta não possui acesso como professor.'
        : 'Esta conta não possui acesso como aluno.'

      return
    }

    error.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      'Não foi possível entrar. Tente novamente.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <form
    class="space-y-5"
    @submit.prevent="handleSubmit"
  >
    <!-- Título -->
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

      <p
        class="mt-2 text-sm leading-6 text-zinc-500"
      >
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
        v-model="form.email"
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
      </div>

      <div class="relative">
        <input
          id="login-password"
          v-model="form.password"
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

    <!-- Erro -->
    <div
      v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ error }}
    </div>

    <!-- Botão -->
    <button
      type="submit"
      :disabled="loading"
      class="w-full rounded-xl bg-[var(--color-primary)] px-5 py-3.5 font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {{ buttonText }}
    </button>

    <!-- Cadastro somente para aluno -->
    <p
      v-if="!isTeacher"
      class="text-center text-sm text-zinc-500"
    >
      Ainda não possui uma conta?

      <NuxtLink
        to="/cadastro"
        class="font-bold text-[var(--color-primary)] transition hover:text-[var(--color-primary-dark)]"
      >
        Criar conta
      </NuxtLink>
    </p>
  </form>
</template>