<template>
  <header class="flex w-full items-center justify-between px-5 py-2.5">
    <CICSLogo :width="68" fill="var(--p-primary-500)" />
    <button
      @click="$emit('close')"
      class="inline-flex size-8 items-center justify-center rounded-lg p-2 text-sm text-neutral-500 hover:bg-primary-100 focus:outline focus:outline-neutral-200 focus:outline-offset-1  dark:hover:bg-primary-900/70 dark:focus:ring-neutral-600"
    >
      <Icon name="tabler:layout-sidebar-left-collapse-filled" />
    </button>
  </header>
  <main class="flex h-full flex-col overflow-visible pb-20">
    <nav
      class="flex max-h-full w-full flex-1 flex-col gap-y-4 overflow-y-auto px-5 pb-6 pt-4"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-x-2 rounded-lg p-2 transition duration-200 hover:text-primary-700 dark:bg-neutral-800 dark:hover:text-primary-200"
        active-class="  text-primary-700 shadow-lg outline outline-gray-300 dark:text-primary-300 dark:outline-neutral-700"
        @click="$emit('close')"
      >
        <Icon name="lucide:house" />
        Inicio</NuxtLink
      >

      <section v-for="item in DefaultLayoutItems" :key="item.sectionName">
        <h3
          class="mb-4 flex select-none items-center gap-x-2 text-sm tracking-tight text-muted-color-emphasis md:text-base"
        >
          {{ item.sectionName }}
        </h3>
        <ul class="flex flex-col gap-1">
          <li v-for="subItem in item.items" :key="subItem.itemName">
            <NuxtLink
              @click="$emit('close')"
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
    <footer class="flex w-full items-center justify-between px-4 py-2.5">
      <template v-if="user">
        <div class="flex items-center">
          <PAvatar class="" shape="circle" :label="displayName?.charAt(0)" />
          <div class="ml-2 flex max-w-32 flex-col items-start">
            <span class="text-sm font-medium">{{ displayNameFull }}</span>
            <span class="text-xs text-muted-color-emphasis">{{
              getRole === 'regular' ? 'Estudiante' : 'Admin'
            }}</span>
          </div>
        </div>
        <div class="space-x-2">
          <CButton
            icon="lucide:layout-dashboard"
            to="/login"
            v-Ptooltip.top="'Dashboard'"
          />
          <CButton icon="lucide:log-out" v-Ptooltip.top="'Cerrar sesión'" />
        </div>
      </template>
    </footer>
  </main>
</template>
<script lang="ts" setup>
import { DefaultLayoutItems } from '~/layouts/default.consts'
import CICSLogo from './CICSLogo.vue'
import CButton from '../primitives/button/CButton.vue';

const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

defineEmits(['close'])

defineProps<{
  items?: typeof DefaultLayoutItems
}>()
</script>
<style scoped lang="postcss">
.menu-item {
  @apply relative flex items-center gap-x-2 rounded-lg py-2 pl-8 pr-2 font-medium outline outline-transparent transition-all duration-200 text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:bg-neutral-800 dark:hover:text-primary-300 hover:before:dark:bg-primary-200;
  &::before {
    @apply absolute left-4 top-1/2 h-[calc(100%+4px)] w-0.5 -translate-y-1/2 bg-gray-300 dark:bg-neutral-700;
    content: '';

    /* Comment if no animation is needed */
    /* @apply transition-all duration-200 ease-in-out; */
  }
}

.active-menu {
  @apply z-50 text-primary-700 shadow-md outline-1 outline-gray-600 focus:text-primary-500 active:text-primary-500 dark:text-primary-500 dark:outline-neutral-600;
  &::before {
    @apply absolute left-4 top-1/2 h-2/4 w-0.5 -translate-y-1/2 rounded bg-primary-700 dark:bg-primary-400;
    content: '';
  }
}
</style>
