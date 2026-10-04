<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  footerText: {
    type: String,
    default: 'Preparação gratuita para o ENEM.'
  }
})

const mascoteSrc = '/images/mascote-conectar-enem.png.png'
</script>

<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10"
  >
    <!-- Fundo -->
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
      <!-- LADO ESQUERDO -->
      <section
        class="relative hidden min-h-[700px] overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] p-10 text-white lg:flex lg:flex-col lg:justify-between"
      >
        <div
          class="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
        />


        <!-- Mascote e texto -->
        <div class="relative z-10">
          <img
            :src="mascoteSrc"
            alt="Mascote do Conectar ENEM"
            width="360"
            height="360"
            class="mx-auto w-full max-w-[320px] object-contain"
          >

          <h2
            class="mt-5 text-3xl font-black leading-tight"
          >
            {{ title }}
          </h2>

          <p
            class="mt-4 max-w-md leading-7 text-purple-100"
          >
            {{ description }}
          </p>
        </div>

        <p
          class="relative z-10 text-sm text-purple-200"
        >
          {{ footerText }}
        </p>
      </section>

      <!-- LADO DIREITO -->
      <section
        class="flex min-h-[700px] items-center bg-white p-6 sm:p-10 lg:p-12"
      >
        <div class="mx-auto w-full max-w-md">

          <img
            :src="mascoteSrc"
            alt="Mascote do Conectar ENEM"
            width="160"
            height="160"
            class="mx-auto mb-6 w-32 object-contain sm:w-36 lg:hidden"
          >

          <!-- Aqui entra SOMENTE o formulário -->
          <slot />
        </div>
      </section>
    </div>
  </main>
</template>
