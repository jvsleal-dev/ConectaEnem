<script setup>
const route = useRoute()

const items = [
  {
    name: 'Início',
    icon: 'home',
    path: '/aluno'
  },
  {
    name: 'Redações',
    icon: 'description',
    path: '/aluno/redacao'
  },
  {
    name: 'Questões',
    icon: 'check_box',
    path: '/aluno/questoes'
  },
  {
    name: 'Estude',
    icon: 'menu_book',
    path: '/aluno/aulas'
  },
  {
    name: 'Relatórios',
    icon: 'monitoring',
    path: '/aluno/perfil'
  }
]

function isActive(path) {
  if (path === '/aluno') {
    return route.path === '/aluno'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-[var(--student-border)] bg-[var(--student-card)]/95 px-2 backdrop-blur-lg md:hidden shadow-lg"
  >
    <NuxtLink
      v-for="item in items"
      :key="item.path"
      :to="item.path"
      class="flex flex-1 flex-col items-center justify-center py-2 transition"
      :class="
        isActive(item.path)
          ? 'text-[var(--student-primary-text)] font-black'
          : 'text-[var(--student-text-secondary)] font-semibold hover:text-[var(--student-text)]'
      "
    >
      <div
        class="flex h-8 w-12 items-center justify-center rounded-2xl transition"
        :class="
          isActive(item.path)
            ? 'bg-[var(--student-primary-soft)] scale-105'
            : 'bg-transparent'
        "
      >
        <span class="material-symbols-rounded text-2xl">
          {{ item.icon }}
        </span>
      </div>

      <span class="mt-0.5 text-[11px] tracking-tight">
        {{ item.name }}
      </span>
    </NuxtLink>
  </nav>
</template>