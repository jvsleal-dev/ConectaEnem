<script setup>
import { useAuth } from '~/composables/useAuth'

const { loginAdmin } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await loginAdmin({
      email: form.email.trim().toLowerCase(),
      password: form.password
    })

    await navigateTo('/admin')
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
      error.value =
        err?.data?.statusMessage ||
        'Esta conta não possui acesso administrativo.'

      return
    }

    error.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      'Não foi possível realizar o login.'
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
    <div>
      <div
        class="mb-4 inline-flex rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-[var(--color-primary)]"
      >
        Área Administrativa
      </div>

      <h1
        class="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl"
      >
        Acesso administrativo
      </h1>

      <p
        class="mt-2 text-sm leading-6 text-zinc-500"
      >
        Entre com sua conta para gerenciar o conteúdo do Conectar ENEM.
      </p>
    </div>

    <!-- Email -->
    <div class="space-y-2">
      <label
        for="admin-email"
        class="text-sm font-semibold text-zinc-700"
      >
        Email
      </label>

      <input
        id="admin-email"
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
      <label
        for="admin-password"
        class="text-sm font-semibold text-zinc-700"
      >
        Senha
      </label>

      <div class="relative">
        <input
          id="admin-password"
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

    <!-- Entrar -->
    <button
      type="submit"
      :disabled="loading"
      class="w-full rounded-xl bg-[var(--color-primary)] px-5 py-3.5 font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {{ loading ? 'Entrando...' : 'Entrar' }}
    </button>

    <!-- Recuperar senha -->
    <NuxtLink
      to="/acesso-admin/recuperar-senha"
      class="block text-center text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-dark)]"
    >
      Esqueci minha senha
    </NuxtLink>

    <NuxtLink
      to="/"
      class="block text-center text-sm text-zinc-500 transition hover:text-zinc-800"
    >
      Voltar para o Conectar ENEM
    </NuxtLink>
  </form>
</template>