<template>
  <div class="min-h-screen dark:bg-neutral-900">
    <div class="flex gap-x-7">
      <nav
        class="hidden w-[22rem] shrink-0 flex-col self-start border-r bg-cics-white py-5 lg:sticky lg:top-0 lg:flex lg:h-screen dark:border-r-neutral-700 dark:bg-neutral-800"
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
        <div class="navigation-menu flex-1 pl-8 pr-6">
          <div>
            <section>
              <h4 class="my-2 select-none text-sm font-medium text-muted-color">
                Principal
              </h4>
              <ul class="flex flex-col gap-1">
                <li>
                  <NuxtLink
                    to="/dashboard/home"
                    class="navigation-menu__item"
                    active-class="navigation-menu__item--active"
                  >
                    <Icon name="icon-park-twotone:home" />
                    <span>Inicio</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/dashboard/profile"
                    class="navigation-menu__item"
                    active-class="navigation-menu__item--active"
                  >
                    <Icon name="icon-park-twotone:people" />
                    <span>Perfil</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/dashboard/wi-fi"
                    class="navigation-menu__item"
                    active-class="navigation-menu__item--active"
                  >
                    <Icon name="icon-park-outline:wifi" />
                    <span>Acceso WiFi</span>
                  </NuxtLink>
                </li>
              </ul>
            </section>
            <section>
              <h4 class="my-2 select-none text-sm font-medium text-muted-color">
                Mis recursos
              </h4>
              <ul class="flex flex-col gap-1">
                <li>
                  <NuxtLink
                    to="/portal/general/horarios"
                    class="navigation-menu__item"
                    active-class="navigation-menu__item--active"
                  >
                    <Icon name="icon-park-twotone:calendar" />
                    <span>Horarios</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/dashboard/pensum/progress"
                    class="navigation-menu__item"
                    active-class="navigation-menu__item--active"
                  >
                    <Icon name="icon-park-twotone:up-and-down" />
                    <span>Progreso</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/dashboard/books"
                    class="navigation-menu__item"
                    active-class="navigation-menu__item--active"
                  >
                    <Icon name="icon-park-twotone:book-one" />
                    <span>Biblioteca / Libros</span>
                  </NuxtLink>
                </li>
              </ul>
            </section>
          </div>
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
          <!-- <button
            class="hidden items-center space-x-3 transition hover:opacity-80 md:flex"
            to="/"
            @click="drawer = true"
          >
            <CICSLogo :width="60" fill="var(--p-primary-500)" />
          </button> -->
          <Transition name="title-fade">
            <NuxtLink class="block text-sm lg:hidden" to="/dashboard/home">
              <strong>CICS App</strong> ⋅ Dashboard
            </NuxtLink>
          </Transition>
        </div>
      </nav>
      <div
        class="mx-auto w-full max-w-screen-xl px-6 pt-16 lg:pr-6 lg:pt-6 dark:bg-neutral-900"
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
        <!-- <SidebarNavigator @close="closeCallback" /> -->
        <!-- mobile menu -->
        <DashboardNavigator @close="closeCallback" />
      </template>
    </PDrawer>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth'
import CICSLogo from '~/components/partials/CICSLogo.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import DashboardNavigator from '~/components/partials/DashboardNavigator.vue'

const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

const { logout } = useAuthStore()

const drawer = ref(false)
</script>
<style lang="postcss" scoped>
.navigation-menu {
  @apply mt-4;
  &__item {
    @apply relative flex items-center gap-x-2 rounded-lg py-2 pl-8 pr-2 font-medium outline outline-transparent transition duration-200 text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:bg-neutral-800 dark:hover:text-primary-300 hover:before:dark:bg-primary-200;
    &::before {
      @apply absolute left-4 top-1/2 h-[calc(100%+4px)] w-0.5 -translate-y-1/2 bg-gray-300 dark:bg-neutral-700;
      content: '';

      /* Comment if no animation is needed */
      @apply transition-all duration-200 ease-in-out;
    }
    /* @apply flex items-center gap-x-2 rounded-lg px-1.5 py-2  outline outline-1 outline-transparent transition hover:text-primary-700 dark:hover:text-primary-200;
     */

    &--active {
      /* @apply outline-black shadow-md; */
      @apply z-50 bg-white text-primary-700 shadow-md outline-1 outline-gray-600 focus:text-primary-500 active:text-primary-500 dark:bg-neutral-800 dark:text-primary-300 dark:outline-neutral-600;
      &::before {
        @apply absolute left-4 top-1/2 h-2/4 w-0.5 -translate-y-1/2 rounded bg-primary-700 dark:bg-primary-400;
        content: '';
      }
    }
  }

  section {
    @apply mb-4;
  }
}
</style>
