<template>
  <div class="min-h-screen lg:bg-cics-white dark:bg-neutral-800">
    <div class="flex gap-x-1">
      <!-- Desktop -->
      <nav
        class="hidden w-[22rem] shrink-0 flex-col self-start bg-cics-white py-5 lg:sticky lg:top-0 lg:flex lg:h-screen dark:bg-neutral-800"
      >
        <h4
          class="flex select-none items-center gap-x-4 px-8 text-lg font-medium"
        >
          <CICSLogo
            :width="56"
            class="inline-block"
            fill="var(--p-primary-500)"
          /> 
          Administación
        </h4>

        <!-- new menu -->
        <div class="navigation-menu flex-1 space-y-4 pl-8 pr-6">
          <NuxtLink
            to="/admin/home"
            class="mt-4 flex items-center gap-x-2 rounded-lg font-medium p-2 transition duration-200 hover:text-primary-700 dark:bg-neutral-800 dark:hover:text-primary-200"
            active-class="  text-primary-700 shadow-md outline outline-1 outline-black dark:text-primary-300 dark:outline-neutral-700"
            @click="$emit('close')"
          >
            <Icon name="lucide:house" />
            Inicio</NuxtLink
          >

          <section v-for="item in ADMIN_LAYOUT_ITEMS" :key="item.sectionName">
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
              <PAvatar
                class="shrink-0"
                shape="circle"
                :label="displayName?.charAt(0)"
              />
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
              <strong>CICS App</strong> ⋅ Administación
            </NuxtLink>
          </Transition>
        </div>
      </nav>
      <div
        class="mx-auto lg:my-2.5 lg:mr-2.5 w-full max-w-screen-xl rounded-xl bg-white px-6 pt-16 lg:pr-6 lg:pt-6 dark:bg-neutral-900"
      >
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
import AdminNavigator from '~/components/partials/AdminNavigator.vue'

// const { user, authenticated } = storeToRefs(useStaffAuthStore())

const { logout } = useAuthStore()
const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

const elevation = computed(() => (drawer.value ? 2 : 0))

const drawer = ref(false)
const currentPage = ref('')
</script>
<style lang="postcss" scoped>
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
