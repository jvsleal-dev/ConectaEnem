<script setup>
import { useAuth } from '~/composables/useAuth'
const props = defineProps({
  accountType: {
    type: String,
    required: true,
    validator: value => ['STUDENT', 'TEACHER'].includes(value)
  }
})

const {
  registerStudent,
  registerTeacher
} = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const loading = ref(false)
const error = ref('')

const isTeacher = computed(() => {
  return props.accountType === 'TEACHER'
})

const title = computed(() => {
  return isTeacher.value
    ? 'Cadastro de professor'
    : 'Crie sua conta'
})

const description = computed(() => {
  return isTeacher.value
    ? 'Crie sua conta como professor de redação no Conectar ENEM.'
    : 'Comece gratuitamente sua preparação para o ENEM.'
})

const buttonText = computed(() => {
  if (loading.value) {
    return 'Criando conta...'
  }

  return isTeacher.value
    ? 'Criar conta de professor'
    : 'Criar minha conta'
})

async function handleSubmit() {
  error.value = ''

  if (form.password !== form.passwordConfirmation) {
    error.value = 'As senhas não coincidem.'
    return
  }

  loading.value = true

  try {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password
    }

    if (isTeacher.value) {
      await registerTeacher(payload)

      await navigateTo('/professor')
      return
    }

    await registerStudent(payload)

    await navigateTo('/aluno')
  }
  catch (err) {
    error.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      'Não foi possível criar sua conta.'
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

    <!-- Nome -->
    <div class="space-y-2">
      <label
        for="register-name"
        class="text-sm font-semibold text-zinc-700"
      >
        Nome completo
      </label>

      <input
        id="register-name"
        v-model="form.name"
        type="text"
        autocomplete="name"
        required
        placeholder="Seu nome completo"
        class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-purple-100"
      >
    </div>

    <!-- Email -->
    <div class="space-y-2">
      <label
        for="register-email"
        class="text-sm font-semibold text-zinc-700"
      >
        Email
      </label>

      <input
        id="register-email"
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
        for="register-password"
        class="text-sm font-semibold text-zinc-700"
      >
        Senha
      </label>

      <div class="relative">
        <input
          id="register-password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          required
          minlength="8"
          placeholder="Mínimo de 8 caracteres"
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

    <!-- Confirmar senha -->
    <div class="space-y-2">
      <label
        for="register-password-confirmation"
        class="text-sm font-semibold text-zinc-700"
      >
        Confirmar senha
      </label>

      <div class="relative">
        <input
          id="register-password-confirmation"
          v-model="form.passwordConfirmation"
          :type="showPasswordConfirmation ? 'text' : 'password'"
          autocomplete="new-password"
          required
          minlength="8"
          placeholder="Digite novamente sua senha"
          class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-20 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-purple-100"
        >

        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-500 transition hover:text-[var(--color-primary)]"
          @click="showPasswordConfirmation = !showPasswordConfirmation"
        >
          {{ showPasswordConfirmation ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>
    </div>

    <div
      v-if="isTeacher"
      class="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3"
    >
      <p class="text-sm leading-6 text-purple-800">
        Cadastro destinado a professores de redação do Conectar ENEM.
      </p>
    </div>

    <!-- Erro -->
    <div
      v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ error }}
    </div>

    <!-- Submit -->
    <button
      type="submit"
      :disabled="loading"
      class="w-full rounded-xl bg-[var(--color-primary)] px-5 py-3.5 font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {{ buttonText }}
    </button>

    <p class="text-center text-sm text-zinc-500">
      Já possui uma conta?

      <NuxtLink
        to="/login"
        class="font-bold text-[var(--color-primary)] transition hover:text-[var(--color-primary-dark)]"
      >
        Entrar
      </NuxtLink>
    </p>
  </form>
</template>