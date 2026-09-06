<script setup>
import { useAuthStore } from '~/stores/auth'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  mobileOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'toggle',
  'close-mobile'
])

const route = useRoute()
const authStore = useAuthStore()

const teacherName = computed(() => authStore.user?.name || 'Professor')

const initials = computed(() => {
  const name = teacherName.value.trim()
  if (!name) return 'PR'
  return name.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()
})

const navigation = [
  {
    label: 'Turmas & Visão Geral',
    icon: 'groups',
    to: '/professor'
  },
  {
    label: 'Redações',
    icon: 'edit_note',
    to: '/professor/redacoes'
  },
  {
    label: 'Relatórios',
    icon: 'insights',
    to: '/professor/relatorios'
  }
]

function isActive(to) {
  if (to === '/professor') {
    return route.path === '/professor' || route.path.startsWith('/professor/turmas')
  }
  return route.path.startsWith(to)
}

function handleItemClick() {
  if (props.mobileOpen) {
    emit('close-mobile')
  }
}

async function handleLogout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
  } finally {
    authStore.clearUser()
    navigateTo('/login')
  }
}
</script>

<template>
  <aside
    class="teacher-sidebar"
    :class="{
      'teacher-sidebar--collapsed': collapsed,
      'teacher-sidebar--mobile-open': mobileOpen
    }"
  >
    <!-- HEADER / BRAND -->
    <div class="teacher-sidebar__header">
      <NuxtLink
        to="/professor"
        class="teacher-brand"
        @click="handleItemClick"
      >
        <span class="teacher-brand__icon">
          <img
            src="/images/logo conta.png"
            alt="Logo Conectar ENEM"
            class="h-full w-full object-contain"
          />
        </span>

        <span
          v-if="!collapsed"
          class="teacher-brand__text"
        >
          <strong>Conectar ENEM</strong>
          <small>Painel do Professor</small>
        </span>
      </NuxtLink>

      <button
        type="button"
        class="teacher-sidebar__collapse"
        :aria-label="collapsed ? 'Expandir menu' : 'Recolher menu'"
        @click="emit('toggle')"
      >
        <span class="material-symbols-rounded">
          {{ collapsed ? 'chevron_right' : 'chevron_left' }}
        </span>
      </button>
    </div>

    <!-- NAVIGATION LINKS -->
    <nav class="teacher-navigation">
      <div class="teacher-navigation__group">
        <span
          v-if="!collapsed"
          class="teacher-navigation__title"
        >
          MENU PRINCIPAL
        </span>

        <NuxtLink
          v-for="item in navigation"
          :key="item.label"
          :to="item.to"
          class="teacher-nav-item"
          :class="{
            'teacher-nav-item--active': isActive(item.to)
          }"
          :title="collapsed ? item.label : undefined"
          @click="handleItemClick"
        >
          <span class="material-symbols-rounded teacher-nav-item__icon">
            {{ item.icon }}
          </span>

          <span
            v-if="!collapsed"
            class="teacher-nav-item__label"
          >
            {{ item.label }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- FOOTER / USER & LOGOUT -->
    <div class="teacher-sidebar__footer">
      <div
        v-if="!collapsed"
        class="teacher-user-profile"
      >
        <div class="teacher-user-avatar">
          {{ initials }}
        </div>
        <div class="teacher-user-info">
          <p class="teacher-user-name" :title="teacherName">{{ teacherName }}</p>
          <span class="teacher-user-role">Docente de Redação</span>
        </div>
      </div>

      <button
        type="button"
        class="teacher-nav-item teacher-nav-item--logout"
        :title="collapsed ? 'Sair' : undefined"
        @click="handleLogout"
      >
        <span class="material-symbols-rounded teacher-nav-item__icon">
          logout
        </span>

        <span
          v-if="!collapsed"
          class="teacher-nav-item__label"
        >
          Sair
        </span>
      </button>
    </div>
  </aside>

  <!-- MOBILE OVERLAY -->
  <Transition name="teacher-overlay">
    <button
      v-if="mobileOpen"
      type="button"
      class="teacher-mobile-overlay"
      aria-label="Fechar menu"
      @click="emit('close-mobile')"
    ></button>
  </Transition>
</template>

<style scoped>
.teacher-sidebar {
  position: fixed;
  z-index: 50;
  inset: 0 auto 0 0;
  width: 260px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  transition: width 0.22s ease, transform 0.22s ease;
}

.teacher-sidebar--collapsed {
  width: 82px;
}

.teacher-sidebar__header {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #f1f5f9;
}

.teacher-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  background: none;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.teacher-brand__icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  overflow: hidden;
  padding: 2px;
}

.teacher-brand__text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.teacher-brand__text strong {
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
}

.teacher-brand__text small {
  font-size: 11px;
  font-weight: 600;
  color: #9333ea;
}

.teacher-sidebar__collapse {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  color: #64748b;
  transition: all 0.15s ease;
}

.teacher-sidebar__collapse:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.teacher-navigation {
  flex: 1;
  overflow-y: auto;
  padding: 20px 12px;
}

.teacher-navigation__group + .teacher-navigation__group {
  margin-top: 24px;
}

.teacher-navigation__title {
  display: block;
  padding: 0 12px 10px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

.teacher-nav-item {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  margin-bottom: 4px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #475569;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s ease;
}

.teacher-sidebar--collapsed .teacher-nav-item {
  justify-content: center;
  padding: 0;
}

.teacher-nav-item__icon {
  font-size: 20px;
  color: #64748b;
  flex-shrink: 0;
}

.teacher-nav-item:hover {
  background: #faf5ff;
  color: #9333ea;
}

.teacher-nav-item:hover .teacher-nav-item__icon {
  color: #9333ea;
}

.teacher-nav-item--active {
  background: #f3e8ff;
  color: #7e22ce;
  font-weight: 800;
}

.teacher-nav-item--active .teacher-nav-item__icon {
  color: #9333ea;
}

.teacher-nav-item--logout {
  color: #ef4444;
}

.teacher-nav-item--logout:hover {
  background: #fef2f2;
  color: #dc2626;
}

.teacher-nav-item--logout:hover .teacher-nav-item__icon {
  color: #dc2626;
}

.teacher-sidebar__footer {
  padding: 12px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.teacher-user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 12px;
}

.teacher-user-avatar {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #f3e8ff;
  color: #7e22ce;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.teacher-user-info {
  min-width: 0;
  flex: 1;
}

.teacher-user-name {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teacher-user-role {
  font-size: 10px;
  color: #64748b;
  display: block;
}

.teacher-mobile-overlay {
  display: none;
}

@media(max-width: 1023px) {
  .teacher-sidebar {
    transform: translateX(-100%);
    box-shadow: 20px 0 50px rgba(0, 0, 0, 0.12);
  }

  .teacher-sidebar--mobile-open {
    transform: translateX(0);
  }

  .teacher-mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 40;
    border: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
  }
}
</style>
