<script setup>
import AdminSidebarItem from '~/components/admin/AdminSidebarItem.vue'
import { useAuth } from '~/composables/useAuth'

const emit = defineEmits([
  'close'
])

const { logout } = useAuth()

const loadingLogout = ref(false)

const contentItems = [
  {
    label: 'Matérias',
    to: '/admin/materias',
    icon: '📚'
  },
  
  {
    label: 'Assuntos',
    to: '/admin/assuntos',
    icon: '🏷️'
  },
  {
    label: 'Aulas',
    to: '/admin/aulas',
    icon: '▶️'
  },
  {
    label: 'Questões',
    to: '/admin/questoes',
    icon: '❓'
  },
  {
    label: 'Simulados',
    to: '/admin/simulados',
    icon: '📝'
  },
  {
    label: 'Flashcards',
    to: '/admin/flashcards',
    icon: '🧠'
  },
  {
    label: 'Biblioteca',
    to: '/admin/biblioteca',
    icon: '📄'
  },
  {
    label: 'Temas de redação',
    to: '/admin/temas-redacao',
    icon: '✍️'
  }
]

const userItems = [
  {
    label: 'Alunos',
    to: '/admin/alunos',
    icon: '🎓'
  },
  {
    label: 'Professores',
    to: '/admin/professores',
    icon: '👨‍🏫'
  },
  {
    label: 'Administradores',
    to: '/admin/administradores',
    icon: '🛡️'
  }
]

async function handleLogout() {
  if (loadingLogout.value) {
    return
  }

  loadingLogout.value = true

  try {
    await logout()

    await navigateTo('/acesso-admin')
  }
  finally {
    loadingLogout.value = false
  }
}

function closeSidebar() {
  emit('close')
}
</script>

<template>
  <aside
    class="flex h-full w-[280px] flex-col border-r border-zinc-200 bg-white"
  >
    <!-- Logo -->
    <div
      class="flex h-20 items-center justify-between border-b border-zinc-100 px-5"
    >
      <NuxtLink
        to="/admin"
        class="flex items-center gap-3"
        @click="closeSidebar"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] font-black text-white shadow-lg shadow-purple-500/20"
        >
          CE
        </div>

        <div>
          <p
            class="text-sm font-black leading-tight text-zinc-900"
          >
            Conectar ENEM
          </p>

          <p
            class="mt-0.5 text-xs font-medium text-zinc-400"
          >
            Administração
          </p>
        </div>
      </NuxtLink>

      <button
        type="button"
        class="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 lg:hidden"
        @click="closeSidebar"
      >
        ✕
      </button>
    </div>

    <!-- Navegação -->
    <nav
      class="flex-1 overflow-y-auto px-4 py-5"
    >
      <!-- Dashboard -->
      <AdminSidebarItem
        label="Dashboard"
        to="/admin"
        icon="⌂"
        exact
        @click="closeSidebar"
      />

      <!-- Conteúdo -->
      <div class="mt-7">
        <p
          class="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400"
        >
          Conteúdo
        </p>

        <div class="space-y-1">
          <AdminSidebarItem
            v-for="item in contentItems"
            :key="item.to"
            :label="item.label"
            :to="item.to"
            :icon="item.icon"
            @click="closeSidebar"
          />
        </div>
      </div>

      <!-- Usuários -->
      <div class="mt-7">
        <p
          class="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400"
        >
          Usuários
        </p>

        <div class="space-y-1">
          <AdminSidebarItem
            v-for="item in userItems"
            :key="item.to"
            :label="item.label"
            :to="item.to"
            :icon="item.icon"
            @click="closeSidebar"
          />
        </div>
      </div>

      <!-- Sistema -->
      <div class="mt-7">
        <p
          class="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400"
        >
          Sistema
        </p>

        <AdminSidebarItem
          label="Configurações"
          to="/admin/configuracoes"
          icon="⚙️"
          @click="closeSidebar"
        />
      </div>
    </nav>

    <!-- Rodapé -->
    <div
      class="border-t border-zinc-100 p-4"
    >
      <button
        type="button"
        :disabled="loadingLogout"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-zinc-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        @click="handleLogout"
      >
        <span
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100"
        >
          ↪
        </span>

        <span>
          {{
            loadingLogout
              ? 'Saindo...'
              : 'Sair'
          }}
        </span>
      </button>
    </div>
  </aside>
</template>