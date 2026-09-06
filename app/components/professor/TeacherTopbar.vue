<script setup>
import { useAuthStore } from '~/stores/auth'

const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'toggle-sidebar',
  'open-mobile-sidebar'
])

const authStore = useAuthStore()
const teacherName = computed(() => authStore.user?.name || 'Professor')

const initials = computed(() => {
  const name = teacherName.value.trim()
  if (!name) return 'PR'
  return name.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()
})
</script>

<template>
  <header class="teacher-topbar">
    <div class="teacher-topbar__left">
      <!-- Mobile menu trigger -->
      <button
        type="button"
        class="teacher-topbar__icon-btn teacher-topbar__icon-btn--mobile"
        aria-label="Abrir menu"
        @click="emit('open-mobile-sidebar')"
      >
        <span class="material-symbols-rounded">menu</span>
      </button>

      <!-- Desktop collapse trigger -->
      <button
        type="button"
        class="teacher-topbar__icon-btn teacher-topbar__icon-btn--desktop"
        :aria-label="sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'"
        @click="emit('toggle-sidebar')"
      >
        <span class="material-symbols-rounded">
          {{ sidebarCollapsed ? 'dock_to_right' : 'dock_to_left' }}
        </span>
      </button>
    </div>

    <div class="teacher-topbar__right">
      <div class="teacher-topbar__user">
        <div class="teacher-topbar__avatar">
          {{ initials }}
        </div>
        <div class="hidden sm:block text-left">
          <p class="text-xs font-bold text-slate-800 leading-none">{{ teacherName }}</p>
          <span class="text-[10px] font-semibold text-slate-400">Professor</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.teacher-topbar {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 30;
}

.teacher-topbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.teacher-topbar__icon-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.teacher-topbar__icon-btn:hover {
  background: #f8fafc;
  color: #0f172a;
}

.teacher-topbar__icon-btn--mobile {
  display: none;
}

.teacher-topbar__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.teacher-topbar__user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.teacher-topbar__avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #f3e8ff;
  color: #7e22ce;
  font-size: 12px;
  font-weight: 800;
  border: 1px solid #e9d5ff;
}

@media(max-width: 1023px) {
  .teacher-topbar {
    padding: 0 16px;
  }

  .teacher-topbar__icon-btn--desktop {
    display: none;
  }

  .teacher-topbar__icon-btn--mobile {
    display: flex;
  }
}
</style>
