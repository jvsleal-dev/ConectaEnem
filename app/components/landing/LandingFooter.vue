<template>
  <footer
    id="sobre"
    class="border-t border-purple-100 bg-white"
  >
    <div
      class="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8"
    >
      <div>
        <NuxtLink
          to="/"
          class="flex items-center gap-3"
        >
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-purple-100 p-0.5"
          >
            <img src="/images/logo conta.png" alt="Logo Conectar ENEM" class="h-full w-full object-contain" />
          </div>

          <span
            class="font-bold text-[var(--color-primary-dark)]"
          >
            Conectar ENEM
          </span>
        </NuxtLink>

        <p
          class="mt-4 max-w-sm text-sm leading-6 text-zinc-500"
        >
          Plataforma social e gratuita de preparação para o ENEM.
        </p>
      </div>

      <div>
        <h3 class="font-bold text-zinc-900">
          Plataforma
        </h3>

        <div
          class="mt-4 flex flex-col gap-3 text-sm text-zinc-500"
        >
          <a
            href="#recursos"
            class="hover:text-[var(--color-primary)]"
          >
            Recursos
          </a>

          <a
            href="#redacao"
            class="hover:text-[var(--color-primary)]"
          >
            Redação
          </a>

          <a
            href="#como-funciona"
            class="hover:text-[var(--color-primary)]"
          >
            Como funciona
          </a>
        </div>
      </div>

      <div>
        <h3 class="font-bold text-zinc-900">
          Conta
        </h3>

        <div
          class="mt-4 flex flex-col gap-3 text-sm text-zinc-500"
        >
          <NuxtLink
            to="/login"
            class="hover:text-[var(--color-primary)]"
          >
            Entrar
          </NuxtLink>

          <NuxtLink
            to="/cadastro"
            class="hover:text-[var(--color-primary)]"
          >
            Criar conta
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="border-t border-purple-100">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between lg:px-8"
      >
        <span>
          © {{ new Date().getFullYear() }} Conectar ENEM.
        </span>

        <span>
          Projeto social de preparação para o ENEM.
        </span>
      </div>
    </div>
  </footer>
</template>