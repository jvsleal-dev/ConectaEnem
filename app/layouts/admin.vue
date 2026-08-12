<script setup>
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminTopbar from '~/components/admin/AdminTopbar.vue'

const sidebarOpen = ref(false)

function openSidebar() {
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>

<template>
  <div
    class="min-h-screen bg-zinc-50"
  >
    <!-- Sidebar desktop -->
    <div
      class="fixed inset-y-0 left-0 z-40 hidden lg:block"
    >
      <AdminSidebar />
    </div>

    <!-- Overlay mobile -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-if="sidebarOpen"
        type="button"
        aria-label="Fechar menu"
        class="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden"
        @click="closeSidebar"
      />
    </Transition>

    <!-- Sidebar mobile -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-y-0 left-0 z-50 lg:hidden"
      >
        <AdminSidebar
          @close="closeSidebar"
        />
      </div>
    </Transition>

    <!-- Área principal -->
    <div class="lg:pl-[280px]">
      <AdminTopbar
        @open-sidebar="openSidebar"
      />

      <main
        class="px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      >
        <div
          class="mx-auto max-w-[1600px]"
        >
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>