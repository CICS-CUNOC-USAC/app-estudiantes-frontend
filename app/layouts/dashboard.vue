<template>
  <div class="min-h-screen dark:bg-neutral-900">
    <div class="flex gap-x-7  ">
      <div
        class="hidden w-[22rem] shrink-0 lg:flex flex-col self-start border-r dark:border-r-neutral-700 bg-cics-white dark:bg-neutral-800 py-5 lg:sticky lg:top-0  lg:h-screen"
      >
        <h4 class="flex select-none items-center px-8 gap-x-4 text-lg font-medium">
          <CICSLogo
            :width="60"
            class="inline-block"
            fill="var(--p-primary-500)"
          />
          Dashboard
        </h4>
        <!-- old menu -->
        <!-- <DashboardNavigator /> -->

        <!-- new menu -->
        <nav class="navigation-menu flex-1 pl-8 pr-6">
          
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
        </nav>

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
              <!-- <CButton
                icon="icon-park-twotone:page-template"
                to="/"
                v-Ptooltip.top="'Regresar al portal'"
              /> -->
              <CButton icon="lucide:log-out" v-Ptooltip.top="'Cerrar sesión'" />
            </div>
          </template>
        </footer>
      </div>
      <div class="w-full pt-6 pr-6 max-w-screen-xl mx-auto dark:bg-neutral-900">
        <NuxtPage />
      </div>
    </div>
  </div>
  <!-- <v-app :theme="theme">
    <v-app-bar :elevation="elevation">
      <template #prepend>
        <v-btn
          :icon="drawer ? 'mdi-backburger' : 'mdi-menu'"
          @click="drawer = !drawer"
        />
      </template>

      <v-app-bar-title class="mt-n1">
        <strong>Dashboard </strong> - CICS APP
      </v-app-bar-title>

      <v-tooltip text="Cerrar sesión" location="bottom">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" @click="logout">
            <v-icon> mdi-logout-variant </v-icon>
          </v-btn>
          <span class="mr-4">
            {{ user?.profile?.first_name }} {{ user?.profile?.last_name }}
          </span>
        </template>
      </v-tooltip>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :width="$vuetify.display.mdAndUp ? 340 : 300"
    >
      <DashboardNavigator @theme="(theme: string) => changeTheme()" />
    </v-navigation-drawer>

    <v-main>
      <v-container class="page-v-container">
        <NuxtPage :theme="theme" />
      </v-container>
    </v-main>
  </v-app> -->
</template>

<script lang="ts" setup>
import DashboardNavigator from '~/components/partials/DashboardNavigator.vue'
import { useRegularAuthStore } from '~/stores/regular-auth'
import { useConfigsStore } from '~/stores/config'
import { useAuthStore } from '~/stores/auth'
import CICSLogo from '~/components/partials/CICSLogo.vue'
import CButton from '~/components/primitives/button/CButton.vue'

const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

const { theme } = storeToRefs(useConfigsStore())
// const { user, authenticated } = storeToRefs(useRegularAuthStore())

const { logout } = useAuthStore()
const { switchTheme, changeTheme } = useConfigsStore()

const elevation = computed(() => (drawer.value ? 2 : 0))

const drawer = ref(false)
const currentPage = ref('')
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
      @apply z-50 bg-white dark:bg-neutral-800 text-primary-700 shadow-md outline-1 outline-gray-600 focus:text-primary-500 active:text-primary-500 dark:text-primary-300 dark:outline-neutral-600;
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
