<template>
  <div class="min-h-screen lg:bg-cics-white dark:bg-neutral-900 lg:dark:bg-neutral-800">
    <div class="flex gap-x-1">
      <!-- Desktop -->
      <nav
        class="hidden w-[22rem] shrink-0 flex-col self-start bg-cics-white py-5 lg:sticky lg:top-0 lg:flex lg:h-screen dark:bg-neutral-800"
      >
        <h4
          class="flex select-none items-center gap-x-4 px-8 text-lg font-medium"
        >
          <CICSLogo
            :width="60"
            class="inline-block"
            fill="var(--p-primary-500)"
          />
          Dashboard
        </h4>

        <!-- new menu -->
        <div class="mt-4 flex-1 space-y-4 pl-8 pr-6">
          <NuxtLink
            to="/dashboard/home"
            class="flex items-center gap-x-2 rounded-lg p-2 font-medium transition duration-200 hover:text-primary-700 dark:bg-neutral-800 dark:hover:text-primary-200"
            active-class="  text-primary-700 shadow-md outline outline-1 outline-black dark:text-primary-300 dark:outline-neutral-700"
            @click="$emit('close')"
          >
            <Icon name="lucide:house" />
            Inicio</NuxtLink
          >

          <section v-for="item in DashboardLayoutItems" :key="item.sectionName">
            <h3
              class="mb-4 flex select-none items-center gap-x-2 text-sm font-medium text-muted-color-emphasis md:text-sm"
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
          <CButton
            icon="icon-park-outline:arrow-left"
            variant="link"
            label="Regresar al portal"
            class="mb-4 text-muted-color-emphasis lg:mb-2"
            to="/"
          />
        </div>

        <footer
          class="flex w-full items-center justify-between gap-2 px-4 py-2.5"
        >
          <template v-if="user">
            <div class="flex min-w-0 items-center">
              <AvatarWithMenu :display-name="displayNameFull" />
              <div class="ml-2 flex min-w-0 flex-col items-start">
                <span
                  class="w-full truncate text-sm font-medium"
                  :title="displayNameFull"
                  >{{ displayNameFull }}</span
                >
                <span class="text-xs text-muted-color-emphasis">
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
      </nav>

      <!-- Mobile -->
      <nav
        class="fixed top-0 z-20 h-14 w-full border-surface-300 bg-white/80 px-4 py-2.5 backdrop-blur-sm transition lg:hidden dark:border-neutral-700 dark:bg-surface-900/80"
      >
        <div class="flex grow basis-0 items-center gap-x-3">
          <button
            @click="drawer = !drawer"
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-lg p-1 text-sm text-gray-500 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 lg:hidden dark:text-neutral-400 dark:hover:bg-primary-900/70 dark:focus:ring-neutral-600"
          >
            <Icon name="tabler:layout-sidebar-filled" />
          </button>
          <Transition name="title-fade">
            <NuxtLink class="block text-sm lg:hidden" to="/dashboard/home">
              <strong>CICS App</strong> ⋅ Dashboard
            </NuxtLink>
          </Transition>
        </div>
      </nav>
      <div
        class="w-full rounded-xl bg-white px-6 pt-16 lg:my-2.5 lg:mr-2.5 lg:pr-6 lg:pt-6 dark:bg-neutral-900"
      >
        <div class="mx-auto  max-w-screen-xl">
          <NuxtPage />
        </div>
      </div>

      <PDrawer
        v-model:visible="drawer"
        block-scroll
        unstyled
        class="h-full w-10/12 bg-cics-white shadow-lg md:w-5/12 dark:bg-neutral-800"
        :pt="{
          transition: {
            name: 'slide'
          },
          mask(options) {
            return {
              class: `bg-primary-950/40 transition-all duration-500 ${options.props.visible ? 'mask-enter' : 'mask-leave'}`
            }
          }
        }"
      >
        <template #container="{ closeCallback }">
          <!-- <SidebarNavigator @close="closeCallback" /> -->
          <!-- mobile menu -->
          <DashboardNavigator @close="closeCallback" />
        </template>
      </PDrawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth'
import CICSLogo from '~/components/partials/CICSLogo.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import DashboardNavigator from '~/components/partials/DashboardNavigator.vue'
import { DashboardLayoutItems } from './dashboard.consts'
import AvatarWithMenu from '~/components/partials/AvatarWithMenu.vue'

const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

const { logout } = useAuthStore()

const drawer = ref(false)
</script>
<style>
@reference 'assets/css/main.css';

.menu-item {
  @apply relative flex items-center gap-x-2 rounded-lg py-2 pl-8 pr-2 font-medium outline outline-transparent transition-all duration-200 text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:bg-neutral-800 dark:hover:text-primary-300 hover:before:dark:bg-primary-200
  before:absolute before:left-4 before:top-1/2 before:h-[calc(100%+4px)] before:w-0.5 before:-translate-y-1/2 before:bg-gray-300 before:dark:bg-neutral-700;
}

.active-menu {
  @apply z-50 text-primary-700 shadow-md outline-1 outline-gray-600 focus:text-primary-500 active:text-primary-500 dark:text-primary-500 dark:outline-neutral-600
  before:absolute before:left-4 before:top-1/2 before:h-2/4 before:w-0.5 before:-translate-y-1/2 before:rounded before:bg-primary-700 before:dark:bg-primary-400
  ;
}
</style>
