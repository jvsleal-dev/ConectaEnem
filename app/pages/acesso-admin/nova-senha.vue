<script setup>
import { useSupabase } from '~/composables/useSupabase'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Nova senha — Conectar ENEM'
})

const supabase = useSupabase()

const password = ref('')
const passwordConfirmation = ref('')

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleSubmit() {
  error.value = ''
  success.value = ''

  if (password.value.length < 8) {
    error.value =
      'A senha deve possuir pelo menos 8 caracteres.'
    return
  }

  if (
    password.value !==
    passwordConfirmation.value
  ) {
    error.value =
      'As senhas não coincidem.'
    return
  }

  loading.value = true

  try {
    const { error: updateError } =
      await supabase.auth.updateUser({
        password: password.value
      })

    if (updateError) {
      throw updateError
    }

    success.value =
      'Senha alterada com sucesso.'

    password.value = ''
    passwordConfirmation.value = ''

    await new Promise(resolve =>
      setTimeout(resolve, 1200)
    )

    await supabase.auth.signOut()

    await navigateTo('/acesso-admin')
  }
  catch (err) {
    console.error(
      'Erro ao alterar senha:',
      err
    )

    error.value =
      err?.message ||
      'Não foi possível alterar sua senha.'
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
        Nova senha
      </div>

      <h1
        class="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl"
      >
        Crie sua nova senha
      </h1>

      <p
        class="mt-2 text-sm leading-6 text-zinc-500"
      >
        Escolha uma nova senha para sua conta administrativa.
      </p>
    </div>

    <form
      class="space-y-5"
      @submit.prevent="handleSubmit"
    >
      <div class="space-y-2">
        <label
          for="new-password"
          class="text-sm font-semibold text-zinc-700"
        >
          Nova senha
        </label>

        <div class="relative">
          <input
            id="new-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            minlength="8"
            required
            placeholder="Mínimo de 8 caracteres"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-20 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-purple-100"
          >

          <button
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-500"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'Ocultar' : 'Mostrar' }}
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label
          for="new-password-confirmation"
          class="text-sm font-semibold text-zinc-700"
        >
          Confirmar nova senha
        </label>

        <div class="relative">
          <input
            id="new-password-confirmation"
            v-model="passwordConfirmation"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            autocomplete="new-password"
            minlength="8"
            required
            placeholder="Digite novamente sua senha"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-20 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-purple-100"
          >

          <button
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-500"
            @click="
              showPasswordConfirmation =
                !showPasswordConfirmation
            "
          >
            {{
              showPasswordConfirmation
                ? 'Ocultar'
                : 'Mostrar'
            }}
          </button>
        </div>
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
        class="w-full rounded-xl bg-[var(--color-primary)] px-5 py-3.5 font-bold text-white transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{
          loading
            ? 'Alterando senha...'
            : 'Salvar nova senha'
        }}
      </button>
    </form>
  </div>
</template>