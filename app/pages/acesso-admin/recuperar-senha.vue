<script setup>
import { useSupabase } from '~/composables/useSupabase'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Recuperar senha — Conectar ENEM'
})

const supabase = useSupabase()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleSubmit() {
  error.value = ''
  success.value = ''

  const normalizedEmail = email.value
    .trim()
    .toLowerCase()

  if (!normalizedEmail) {
    error.value = 'Informe seu email.'
    return
  }

  loading.value = true

  try {
    const redirectTo =
      `${window.location.origin}/acesso-admin/nova-senha`

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo
        }
      )

    if (resetError) {
      throw resetError
    }

    success.value =
      'Enviamos um link de recuperação para seu email.'
  }
  catch (err) {
    console.error(
      'Erro ao enviar recuperação de senha:',
      err
    )

    error.value =
      err?.message ||
      'Não foi possível enviar o email de recuperação.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <div class="mb-6">
      <div
        class="mb-4 inline-flex rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-[var(--color-primary)]"
      >
        Recuperação de senha
      </div>

      <h1
        class="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl"
      >
        Esqueceu sua senha?
      </h1>

      <p
        class="mt-2 text-sm leading-6 text-zinc-500"
      >
        Informe o email da sua conta administrativa.
        Enviaremos um link para você criar uma nova senha.
      </p>
    </div>

    <form
      class="space-y-5"
      @submit.prevent="handleSubmit"
    >
      <div class="space-y-2">
        <label
          for="recovery-email"
          class="text-sm font-semibold text-zinc-700"
        >
          Email
        </label>

        <input
          id="recovery-email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          placeholder="seuemail@exemplo.com"
          class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-purple-100"
        >
      </div>

      <div
        v-if="error"
        class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
      >
        {{ error }}
      </div>

      <div
        v-if="success"
        class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
      >
        {{ success }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-xl bg-[var(--color-primary)] px-5 py-3.5 font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{
          loading
            ? 'Enviando...'
            : 'Enviar link de recuperação'
        }}
      </button>

      <NuxtLink
        to="/acesso-admin"
        class="block text-center text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-dark)]"
      >
        Voltar para o login
      </NuxtLink>
    </form>
  </div>
</template>