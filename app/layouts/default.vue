<template>
  <div>
    <nav
      class="fixed top-0 z-20 h-14 w-full border-surface-300 backdrop-blur-sm transition dark:border-neutral-700"
      :class="{
        'bg-cics-white dark:bg-neutral-800': !hasScrolled,
        'border-b bg-cics-white/80 shadow-md dark:bg-surface-800/80':
          hasScrolled
      }"
    >
      <div
        class="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-2.5"
      >
        <div class="flex grow basis-0 items-center gap-x-3">
          <button
            @click="drawer = !drawer"
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 md:hidden dark:text-neutral-400 dark:hover:bg-primary-900/70 dark:focus:ring-neutral-600"
          >
            <Icon name="lucide:menu" />
          </button>
          <button
            class="hidden items-center space-x-3 transition hover:opacity-80 md:flex"
            to="/"
            @click="drawer = true"
          >
            <CICSLogo :width="60" fill="var(--p-primary-500)" />
          </button>
          <Transition name="title-fade">
            <NuxtLink class="block md:hidden text-sm" to="/" v-if="!searchOpen">
              <strong>CICS App</strong> ⋅ Portal
            </NuxtLink>
          </Transition>
        </div>

        <div
          class="hidden items-center justify-between lg:order-1 lg:flex lg:w-auto"
        >
          <ul
            class="mt-4 flex flex-col rounded-lg border p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0"
          >
            <li>
              <NuxtLink to="/" class="" aria-current="page">Inicio</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/portal/extras/config" class="">Config</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="relative flex grow basis-0 justify-end gap-x-1 md:order-2">
          <div class="flex items-center">
            <Transition name="fade-slide">
              <form
                v-if="searchOpen"
                class="mr-2 h-full w-64 md:max-xl:w-44"
                @submit.prevent="handleSearch"
              >
                <CInputText
                  v-model="search"
                  type="search"
                  ref="$search"
                  placeholder="Buscar en Ingeniería CUNOC"
                  class="search-box"
                />
              </form>
            </Transition>
            <CButton
              :icon="searchOpen ? 'lucide:search-slash' : 'lucide:search'"
              @click="toggleSearch"
            />
          </div>

          <CButton
            v-if="!searchOpen"
            icon="lucide:user"
            :to="user ? '/dashboard/home' : '/login'"
            :label="user ? displayName : 'Ingresar'"
            class="!px-2"
            pt:label:class="hidden lg:block"
          />
        </div>
      </div>
    </nav>

    <PDrawer
      v-model:visible="drawer"
      block-scroll
      unstyled
      class="h-full w-10/12 md:w-5/12 bg-cics-white shadow-lg dark:bg-neutral-800"
      pt:mask:class="bg-black/50 transition"
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
        <header class="flex w-full items-center justify-between px-5 py-4">
          <CICSLogo :width="68" fill="var(--p-primary-500)" />
          <button
            @click="closeCallback"
            class="inline-flex size-8 items-center justify-center rounded-lg p-2 text-sm text-neutral-500 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-primary-900/70 dark:focus:ring-neutral-600"
          >
            <Icon name="lucide:x" />
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
              @click="closeCallback"
            >
              <Icon name="lucide:house" />
              Inicio</NuxtLink
            >

            <section v-for="item in DefaultLayoutItems" :key="item.sectionName">
              <h3
                class="mb-4 flex items-center gap-x-2 text-sm tracking-tight text-muted-color-emphasis md:text-base select-none"
              >
                {{ item.sectionName }}
              </h3>
              <ul class="flex flex-col gap-1">
                <li v-for="subItem in item.items" :key="subItem.itemName">
                  <NuxtLink
                    @click="closeCallback"
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
                <PAvatar
                  class=""
                  shape="circle"
                  :label="displayName?.charAt(0)"
                />
                <div class="ml-2 flex flex-col items-start overflow-hidden max-w-32">
                  <span class="text-sm font-medium">{{ displayNameFull }}</span>
                  <span class="text-xs text-muted-color-emphasis" 
                    >{{ getRole === 'regular' ? 'Estudiante' : 'Admin' }}</span
                  >
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
    </PDrawer>

    <div class="d-flex flex-column">
      <main id="appcont" class="mx-auto max-w-screen-xl px-5 pt-16 lg:px-8">
        <NuxtPage />
      </main>

      <!-- <v-footer style="flex-grow: 0" class="pa-4">
    <v-col class="text-center" cols="12">
      <strong>CICS</strong> — {{ new Date().getFullYear() }}
    </v-col>
  </v-footer> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import CICSLogo from '~/components/partials/CICSLogo.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { useAuthStore } from '~/stores/auth'
import { DefaultLayoutItems } from './default.consts'

const { user, displayName, displayNameFull, getRole } = storeToRefs(useAuthStore())

const drawer = ref(false)

const hasScrolled = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    hasScrolled.value = window.scrollY > 30
  })
})

const searchOpen = ref(false)
const search = ref('')
const $search = ref(null)
const toggleSearch = async () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    search.value = ''
    await nextTick()
    $search.value.$input.$el.focus()
  }
}
const handleSearch = () => {
  if (search.value) {
    navigateTo({
      path: '/portal/general/busqueda',
      query: {
        q: search.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      }
    })
    searchOpen.value = false
    search.value = ''
  }
}
</script>
<style lang="postcss">
.menu-item {
  @apply relative flex items-center gap-x-2 rounded-lg py-2 pl-8 pr-2 outline outline-transparent transition-all duration-200 text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:bg-neutral-800 dark:hover:text-primary-300 hover:before:dark:bg-primary-200 font-medium;
  &::before {
    @apply absolute left-4 top-1/2 h-[calc(100%+4px)] w-0.5 -translate-y-1/2 bg-gray-300  dark:bg-neutral-700;
    content: '';

    /* Comment if no animation is needed */
    /* @apply transition-all duration-200 ease-in-out; */
  }
}

.active-menu {
  @apply z-50 text-primary-700 shadow-md outline-gray-600 dark:text-primary-500 active:text-primary-500 focus:text-primary-500 dark:outline-neutral-600;
  &::before {
    @apply absolute left-4 top-1/2 h-2/4 w-0.5 -translate-y-1/2 rounded bg-primary-700 dark:bg-primary-400;
    content: '';
  }
}

.title-fade-leave-active {
  @apply transition-all duration-100;
}

.title-fade-enter-active {
  @apply transition-all delay-200 duration-200;
}

.title-fade-enter-from,
.title-fade-leave-to {
  @apply opacity-0;
}

.search-box {
  @apply h-full;
}
</style>
