<template>
  <div
    class="lg:bg-cics-white dark:bg-surface-900 lg:dark:bg-surface-900 min-h-screen"
  >
    <div class="flex gap-x-1">
      <!-- Desktop -->
      <nav
        class="bg-cics-white dark:bg-surface-900 hidden w-[22rem] shrink-0 flex-col self-start py-5 lg:sticky lg:top-0 lg:flex lg:h-screen"
      >
        <h4
          class="flex items-center gap-x-4 px-8 text-lg font-medium select-none"
        >
          <CICSLogo
            :width="56"
            class="inline-block"
            fill="var(--p-primary-500)"
          />
          Administración
        </h4>

        <!-- new menu -->
        <div class="navigation-menu flex-1 space-y-4 pr-6 pl-8">
          <NuxtLink
            to="/admin/home"
            class="hover:text-primary-700 text-lg dark:hover:text-primary-200 mt-4 flex items-center gap-x-2 rounded-lg p-2 font-medium transition duration-200"
            active-class="  text-primary-700 shadow-md outline outline-black dark:text-primary-300 dark:outline-surface-700"
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
                    :to="subItem.itemLink"
                    active-class="active-menu"
                    class="menu-item"
                  >
                    <Icon :name="subItem.itemIcon" />
                    {{ subItem.itemName }}</NuxtLink
                  >
                </Can>
              </li>
            </ul>
          </section>
          <CButton
            icon="icon-park-outline:arrow-left"
            variant="link"
            label="Regresar al portal"
            class="text-muted-color-emphasis mb-4 lg:mb-2"
            to="/"
          />
        </div>

        <footer
          class="flex w-full items-center justify-between gap-2 px-4 py-2.5"
        >
          <template v-if="user">
            <div class="flex h-full min-w-0 items-center gap-2">
              <AvatarWithMenu :display-name="displayNameFull" />

              <div class="flex min-w-0 flex-col items-start">
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
      </nav>

      <!-- Mobile -->
      <nav
        class="border-surface-300 dark:bg-surface-800/80 fixed top-0 z-20 h-14 w-full bg-white/80 px-4 py-2.5 backdrop-blur-sm transition lg:hidden dark:border-surface-700"
      >
        <div class="flex grow basis-0 items-center gap-x-3">
          <button
            @click="drawer = !drawer"
            type="button"
            class="hover:bg-primary-100 dark:hover:bg-primary-900/70 inline-flex size-9 items-center justify-center rounded-lg p-1 text-sm text-gray-500 focus:ring-2 focus:ring-surface-200 focus:outline-none lg:hidden dark:text-surface-400 dark:focus:ring-surface-600"
          >
            <Icon name="lucide:menu" />
          </button>
          <Transition name="title-fade">
            <NuxtLink class="block text-sm lg:hidden" to="/dashboard/home">
              <strong>CICS App</strong> ⋅ Administación
            </NuxtLink>
          </Transition>
        </div>
      </nav>
      <div
        class="dark:bg-surface-800 min-h-screen w-full rounded-xl bg-white px-6 pt-16 lg:my-2.5 lg:mr-2.5 lg:min-h-auto lg:pt-6 lg:pr-6"
      >
        <div class="mx-auto max-w-screen-xl">
          <NuxtPage />
        </div>
      </div>
    </div>

    <PDrawer
      v-model:visible="drawer"
      block-scroll
      unstyled
      class="bg-cics-white h-full w-10/12 shadow-lg md:w-5/12 dark:bg-surface-800"
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
        <AdminNavigator @close="closeCallback" />
      </template>
    </PDrawer>
  </div>
</template>

<script lang="ts" setup>
import CICSLogo from '~/components/partials/CICSLogo.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import { useAuthStore } from '~/stores/auth'
import { ADMIN_LAYOUT_ITEMS } from './admin.consts'
import { NuxtLink } from '#components'
import AdminNavigator from '~/components/partials/AdminNavigator.vue'
import AvatarWithMenu from '~/components/partials/AvatarWithMenu.vue'
import { showMenuItem } from '~/shared/utils/abilities'

const { logout } = useAuthStore()
const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

const drawer = ref(false)
</script>
<style scoped>
@reference '~/assets/css/main.css';

.menu-item {
  @apply text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:hover:text-primary-300 hover:before:dark:bg-primary-200 before:bg-surface-300 dark:before:bg-surface-700 relative flex items-center gap-x-2 rounded-lg py-2 pr-2 pl-8 font-medium outline outline-transparent transition-all duration-200 before:absolute before:top-1/2 before:left-4 before:h-[calc(100%+4px)] before:w-0.5 before:-translate-y-1/2;
}

.active-menu {
  @apply text-primary-700 focus:text-primary-500 active:text-primary-500 dark:text-primary-500 before:bg-primary-700 before:dark:bg-primary-400 z-50 shadow-md outline-1 outline-gray-600 before:absolute before:top-1/2 before:left-4 before:h-2/4 before:w-0.5 before:-translate-y-1/2 before:rounded dark:outline-surface-600;
}
</style>
