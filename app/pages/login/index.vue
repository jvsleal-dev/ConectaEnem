<script setup>
import LoginRoleSelector from '~/components/auth/LoginRoleSelector.vue'
import LoginForm from '~/components/auth/LoginForm.vue'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Entrar — Conectar ENEM',
  description: 'Entre na sua conta do Conectar ENEM.'
})

const activeRole = ref('STUDENT')

const transitionName = computed(() => {
  return activeRole.value === 'TEACHER'
    ? 'slide-left'
    : 'slide-right'
})

function handleLogin(credentials) {
  console.log('Dados do login:', credentials)
}
</script>

<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10"
  >
    <!-- Luzes de fundo -->
    <div
      class="absolute -left-40 top-20 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl"
    />

    <div
      class="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-3xl"
    />

    <!-- Card principal -->
    <div
      class="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-2xl shadow-purple-500/10 lg:grid-cols-[1fr_1.05fr]"
    >
      <!-- ============================= -->
      <!-- LADO ESQUERDO -->
      <!-- ============================= -->

      <section
        class="relative hidden min-h-[650px] overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] p-10 text-white lg:flex lg:flex-col lg:justify-between"
      >
        <div
          class="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
        />

        <!-- Logo -->
        <NuxtLink
          to="/"
          class="relative z-10 flex items-center gap-3"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-[var(--color-primary)]"
          >
            C
          </div>

          <span class="text-lg font-black">
            Conectar ENEM
          </span>
        </NuxtLink>

        <!-- Mascote -->
        <div class="relative z-10">
          <img
            src="/images/mascote-conectar-enem.png"
            alt="Mascote do Conectar ENEM"
            width="360"
            height="360"
            class="mx-auto w-full max-w-[330px] object-contain"
          >

          <h2 class="mt-6 text-3xl font-black leading-tight">
            Continue conectado ao seu futuro.
          </h2>

          <p class="mt-4 max-w-md leading-7 text-purple-100">
            Estude, pratique, escreva redações e acompanhe sua
            evolução em um só lugar.
          </p>
        </div>

        <p class="relative z-10 text-sm text-purple-200">
          Preparação gratuita para o ENEM.
        </p>
      </section>

      <!-- ============================= -->
      <!-- LADO DIREITO -->
      <!-- ============================= -->

      <section
        class="flex min-h-[650px] items-center bg-white p-6 sm:p-10 lg:p-12"
      >
        <div class="mx-auto w-full max-w-md">

          <!-- Logo no celular -->
          <NuxtLink
            to="/"
            class="mb-8 flex items-center gap-3 lg:hidden"
          >
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] font-black text-white"
            >
              C
            </div>

            <span
              class="font-black text-[var(--color-primary-dark)]"
            >
              Conectar ENEM
            </span>
          </NuxtLink>

          <!-- Aluno / Professor -->
          <LoginRoleSelector
            v-model="activeRole"
          />

          <!-- Formulário -->
          <div class="mt-8 overflow-hidden">
            <Transition
              :name="transitionName"
              mode="out-in"
            >
              <LoginForm
                :key="activeRole"
                :role="activeRole"
                @submit="handleLogin"
              />
            </Transition>
          </div>

        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(28px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-28px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-28px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(28px);
}

@media (prefers-reduced-motion: reduce) {
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: none;
  }
}
</style>