<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'
import { ADMIN_LAYOUT_ITEMS } from '~/layouts/admin.consts'
import AvatarWithMenu from '../AvatarWithMenu.vue'
import CICSLogo from '../CICSLogo.vue'

const { toggleSidebar, isMobile } = useSidebar()

const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

const { logout } = useAuthStore()
</script>

<template>
  <Sidebar
    class="bg-cics-white dark:bg-surface-900 border-surface-950/75 dark:border-surface-700/50"
  >
    <SidebarHeader class="flex items-center justify-between gap-4 px-4 py-3">
      <h4 class="flex items-center gap-x-4  font-medium select-none">
        <CICSLogo
          :width="60"
          class="inline-block"
          fill="var(--color-primary-500)"
        />
        Administración
      </h4>
    </SidebarHeader>
    <SidebarContent>
      <nav
        class="flex max-h-full w-full flex-1 flex-col gap-y-4 overflow-y-auto px-5 pt-4 pb-6"
      >
        <NuxtLink
          to="/dashboard/home"
          class="hover:text-primary-700 dark:bg-surface-900 dark:hover:text-primary-200 flex items-center gap-x-2 rounded-lg p-2 transition duration-200"
          active-class="  text-primary-700 shadow-lg outline outline-black dark:text-primary-300 dark:outline-surface-700"
          @click="$emit('close')"
        >
          <Icon name="lucide:house" />
          Inicio</NuxtLink
        >

        <section v-for="item in ADMIN_LAYOUT_ITEMS" :key="item.sectionName">
          <h3
            class="text-muted-color-emphasis mb-4 flex items-center gap-x-2 text-sm font-medium select-none md:text-sm"
          >
            {{ item.sectionName }}
          </h3>
          <ul class="flex flex-col gap-1">
            <li v-for="subItem in item.items" :key="subItem.itemName">
              <NuxtLink
                 @click="
                  () => {
                    isMobile ? toggleSidebar() : null
                  }
                "
                :to="subItem.itemLink"
                active-class="active-menu"
                class="menu-item"
              >
                <Icon :name="subItem.itemIcon" />
                {{ subItem.itemName }}</NuxtLink
              >
            </li>
          </ul>
        </section>
      </nav>
    </SidebarContent>
    <SidebarFooter
      class="flex w-full items-center justify-between gap-2 px-4 py-2.5"
    >
      <template v-if="user">
        <div class="flex h-full min-w-0 items-center">
          <AvatarWithMenu :display-name="displayNameFull" />
          <div class="ml-2 flex min-w-0 flex-col items-start">
            <span
              class="w-full truncate text-sm font-medium"
              :title="displayNameFull"
              >{{ displayNameFull }}</span
            >
            <span class="text-muted-color-emphasis text-xs">
              {{ getRole === 'regular' ? 'Estudiante' : 'Admin' }}
            </span>
          </div>
        </div>
        <div class="shrink-0 space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button icon="icon-park-outline:grid-three" to="/" />
              </TooltipTrigger>
              <TooltipContent> Portal </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button icon="icon-park-outline:logout" @click="logout" />
              </TooltipTrigger>
              <TooltipContent> Cerrar sesión </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </template>
    </SidebarFooter>
  </Sidebar>
</template>
<style scoped>
@reference '~/assets/css/main.css';

.menu-item {
  @apply text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:hover:text-primary-300 dark:hover:before:bg-primary-200 dark:bg-surface-900 dark:before:bg-surface-700 relative flex items-center gap-x-2 rounded-lg py-2 pr-2 pl-8 font-medium ring inset-ring ring-transparent inset-ring-transparent transition duration-200 before:absolute before:top-1/2 before:left-4 before:h-[calc(100%+4px)] before:w-0.5 before:-translate-y-1/2 before:rounded before:bg-gray-300 before:transition;
}

.active-menu {
  @apply text-primary-700 focus:text-primary-500 active:text-primary-500 dark:text-primary-500 before:bg-primary-700 before:dark:bg-primary-400 dark:ring-surface-600 dark:hover:inset-ring-surface-600 z-50 shadow-md ring-gray-800 transition before:absolute before:top-1/2 before:left-4  before:w-0.5 before:-translate-y-1/2 before:rounded hover:inset-ring-1 hover:inset-ring-gray-800;

  /* @apply before:h-2/4; */
  @apply before:scale-y-50; 
  /* &::before {
    @apply bg-primary-700 dark:bg-primary-400 absolute top-1/2 left-4 h-2/4 w-0.5 -translate-y-1/2 rounded;
    content: '';
  } */
}
</style>
