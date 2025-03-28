<template>
  <header class="flex w-full items-center justify-between px-5 py-2.5">
    <CICSLogo :width="68" fill="var(--p-primary-500)" />
    <button
      @click="$emit('close')"
      class="hover:bg-primary-100 dark:hover:bg-primary-900/70 inline-flex size-8 items-center justify-center rounded-lg p-2 text-sm text-surface-500 focus:outline focus:outline-offset-1 focus:outline-surface-200 dark:focus:ring-surface-600"
    >
      <Icon name="lucide:x" />
    </button>
  </header>
  <main class="flex h-full flex-col overflow-visible pb-16">
    <nav
      class="flex max-h-full w-full flex-1 flex-col gap-y-4 overflow-y-auto px-5 pt-4 pb-6"
    >
      <NuxtLink
        to="/admin/home"
        class="hover:text-primary-700 dark:hover:text-primary-200 flex items-center gap-x-2 rounded-lg p-2 transition duration-200"
        active-class="  text-primary-700 shadow-lg outline outline-1 outline-black dark:text-primary-300 dark:outline-surface-700"
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
            <Can
              :ability="showMenuItem"
              :args="[subItem.action, subItem.subject]"
            >
              <NuxtLink
                @click="$emit('close')"
                :to="subItem.itemLink"
                active-class="active-menu"
                class="menu-item"
              >
                <Icon :name="subItem.itemIcon" />
                {{ subItem.itemName }}</NuxtLink
              >
            </Can>
            <!-- <NuxtLink
              v-else
              @click="$emit('close')"
              :to="subItem.itemLink"
              active-class="active-menu"
              class="menu-item"
            >
              <Icon :name="subItem.itemIcon" />
              {{ subItem.itemName }}</NuxtLink
            > -->
          </li>
        </ul>
      </section>
    </nav>
    <footer class="flex w-full items-center justify-between gap-2 px-4 py-2.5">
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
          <CButton
            icon="lucide:layout-dashboard"
            to="/"
            v-Ptooltip.top="'Portal'"
          />
          <CButton
            icon="lucide:log-out"
            v-Ptooltip.top="'Cerrar sesión'"
            @click="logout"
          />
        </div>
      </template>
    </footer>
  </main>
</template>
<script lang="ts" setup>
import { DefaultLayoutItems } from '~/layouts/default.consts'
import CICSLogo from './CICSLogo.vue'
import CButton from '../primitives/button/CButton.vue'
import { DashboardLayoutItems } from '~/layouts/dashboard.consts'
import { ADMIN_LAYOUT_ITEMS } from '~/layouts/admin.consts'
import AvatarWithMenu from './AvatarWithMenu.vue'
import { showMenuItem } from '~/shared/utils/abilities'

const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

const { logout } = useAuthStore()

defineEmits(['close'])

defineProps<{
  items?: typeof DefaultLayoutItems
}>()
</script>
<style>
@reference '~/assets/css/main.css';

.menu-item {
  @apply text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:hover:text-primary-300 dark:hover:before:bg-primary-200 relative flex items-center gap-x-2 rounded-lg py-2 pr-2 pl-8 font-medium inset-ring ring ring-transparent inset-ring-transparent transition duration-200 before:absolute before:top-1/2 before:left-4 before:h-[calc(100%+4px)] before:w-0.5 before:-translate-y-1/2 before:rounded before:bg-gray-300 before:transition dark:before:bg-surface-700;
}

.active-menu {
  @apply text-primary-700 focus:text-primary-500 active:text-primary-500 dark:text-primary-500 before:bg-primary-700 before:dark:bg-primary-400 z-50 shadow-md ring-gray-800 transition before:absolute before:top-1/2 before:left-4 before:h-2/4 before:w-0.5 before:-translate-y-1/2 before:rounded hover:inset-ring hover:inset-ring-gray-800 dark:ring-surface-600 dark:hover:inset-ring-surface-600;
  /* &::before {
    @apply bg-primary-700 dark:bg-primary-400 absolute top-1/2 left-4 h-2/4 w-0.5 -translate-y-1/2 rounded;
    content: '';
  } */
}
</style>
