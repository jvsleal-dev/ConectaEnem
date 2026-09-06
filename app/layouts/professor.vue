<script setup>
import TeacherSidebar from '~/components/professor/TeacherSidebar.vue'
import TeacherTopbar from '~/components/professor/TeacherTopbar.vue'

const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function openMobileSidebar() {
  mobileSidebarOpen.value = true
}

function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}
</script>

<template>
  <div class="teacher-shell">
    <TeacherSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileSidebarOpen"
      @toggle="toggleSidebar"
      @close-mobile="closeMobileSidebar"
    />

    <div
      class="teacher-main"
      :class="{
        'teacher-main--collapsed': sidebarCollapsed
      }"
    >
      <TeacherTopbar
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
        @open-mobile-sidebar="openMobileSidebar"
      />

      <main class="teacher-content">
        <div class="teacher-content-inner">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.teacher-shell {
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
}

.teacher-main {
  min-height: 100vh;
  margin-left: 260px;
  transition: margin-left 220ms ease;
}

.teacher-main--collapsed {
  margin-left: 82px;
}

.teacher-content {
  min-height: calc(100vh - 72px);
  padding: 28px;
}

.teacher-content-inner {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1023px) {
  .teacher-main,
  .teacher-main--collapsed {
    margin-left: 0;
  }

  .teacher-content {
    padding: 20px 16px 32px;
  }
}
</style>
