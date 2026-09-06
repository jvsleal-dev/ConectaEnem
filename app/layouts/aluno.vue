<script setup>
import '../assets/css/student-theme.css'

import AlunoSidebar
  from '../components/aluno/Sidebar.vue'

import AlunoHeader
  from '../components/aluno/Header.vue'

import AlunoMobileNav
  from '../components/aluno/MobileNav.vue'

import {
  useTheme
} from '../composables/useTheme'

import {
  useStudentShell
} from '../composables/useStudentShell'


const {
  theme
} = useTheme()


const {
  sidebarCollapsed,
  toggleSidebar
} = useStudentShell()
</script>


<template>
  <div
    class="
      student-shell
      min-h-dvh
    "
    :data-theme="theme"
  >
    <!-- SIDEBAR DESKTOP -->
    <AlunoSidebar
      :collapsed="sidebarCollapsed"
      @toggle="toggleSidebar"
    />


    <!-- CONTEÚDO -->
    <div
      class="
        min-h-dvh
        min-w-0
        transition-[margin]
        duration-300
        ease-out
      "
      :class="
        sidebarCollapsed
          ? 'lg:ml-[88px]'
          : 'lg:ml-[280px]'
      "
    >
      <AlunoHeader />

      <main
        class="
          student-page-content
          min-w-0
          overflow-x-hidden
        "
      >
        <slot />
      </main>
    </div>


    <!-- NAVEGAÇÃO MOBILE -->
    <AlunoMobileNav />
  </div>
</template>