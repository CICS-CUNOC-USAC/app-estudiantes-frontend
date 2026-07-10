<template>
  <SidebarProvider :default-open="true">
    <AdminSidebar />
    <SidebarFloatingToggle />
    <div class="dark:bg-surface-800 w-full bg-white">
      <nav
        class="dark:bg-surface-800/80 fixed top-0 z-20 h-14 w-full bg-white/80 px-4 py-2.5 backdrop-blur-sm transition-shadow lg:hidden"
        :class="{
          'border-b border-transparent': !hasScrolled,
          'border-b border-neutral-200 shadow-md dark:border-neutral-700/75':
            hasScrolled
        }"
      >
        <div class="flex grow basis-0 items-center gap-x-3">
          <SidebarTrigger class="py-2"> </SidebarTrigger>

          <NuxtLink class="block text-sm lg:hidden" to="/admin/home">
            <strong>CICS App</strong> ⋅ Administración
          </NuxtLink>
        </div>
      </nav>
      <div
        class="mx-auto w-full rounded-xl pb-4 pt-16 lg:pt-6"
        :class="$route.meta.wideScreen ? 'px-3 sm:px-5 lg:px-7' : 'max-w-7xl px-6'"
      >
        <NuxtPage />
      </div>
    </div>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import AdminSidebar from '~/components/partials/navigation/AdminSidebar.vue'
import SidebarFloatingToggle from '~/components/partials/navigation/SidebarFloatingToggle.vue'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'

const { hasScrolled } = useNavScrollShadow()
</script>
<style scoped>
@reference '~/assets/css/main.css';

.menu-item {
  @apply text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:hover:text-primary-300 hover:before:dark:bg-primary-200 before:bg-surface-300 dark:before:bg-surface-700 relative flex items-center gap-x-2 rounded-lg py-2 pr-2 pl-8 font-medium outline outline-transparent transition-all duration-200 before:absolute before:top-1/2 before:left-4 before:h-[calc(100%+4px)] before:w-0.5 before:-translate-y-1/2;
}

.active-menu {
  @apply text-primary-700 focus:text-primary-500 active:text-primary-500 dark:text-primary-500 before:bg-primary-700 before:dark:bg-primary-400 dark:outline-surface-600 z-50 shadow-md outline-1 outline-gray-600 before:absolute before:top-1/2 before:left-4 before:h-2/4 before:w-0.5 before:-translate-y-1/2 before:rounded;
}
</style>
