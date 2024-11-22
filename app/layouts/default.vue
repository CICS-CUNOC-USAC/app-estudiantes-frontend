<template>
  <div>
    <nav
      class="fixed top-0 z-20 h-14 w-full border-surface-300  backdrop-blur-sm transition dark:border-neutral-700 "
      :class="{
        'bg-white dark:bg-neutral-800': !hasScrolled,
        'border-b bg-surface-50/85 shadow-md dark:bg-surface-900/85':
          hasScrolled
      }"
    >
      <div
        class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-2"
      >
        <div class="flex items-center gap-x-3">
          <button
            @click="drawer = !drawer"
            data-collapse-toggle="navbar-sticky"
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <Icon name="lucide:menu" />
          </button>
          <NuxtLink class="hidden items-center space-x-3 md:flex" href="/">
            <CICSLogo :width="64" fill="var(--p-primary-500)" />
          </NuxtLink>
          <Transition name="title-fade">
            <NuxtLink class="block md:hidden" href="/" v-if="!searchOpen">
              <strong>CICS App</strong> ⋅ Portal
            </NuxtLink>
          </Transition>
        </div>

        <div
          class="hidden w-64 items-center justify-between md:order-1 md:flex md:w-auto"
          id="navbar-sticky"
        >
          <ul
            class="mt-4 flex flex-col rounded-lg border p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0"
          >
            <li>
              <NuxtLink
                to="/"
                class="block rounded bg-blue-700 px-3 py-2 text-white md:bg-transparent md:p-0 md:text-blue-700 md:dark:text-blue-500"
                aria-current="page"
                >Inicio</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/portal/extras/config"
                class="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                >About</NuxtLink
              >
            </li>
            <li>
              <a
                href="#"
                class="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                >Services</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                >Contact</a
              >
            </li>
          </ul>
        </div>
        <div class="relative flex space-x-3 md:order-2 md:space-x-0">
          <div class="flex grow-0 items-center">
            <Transition name="fade-slide">
              <form
                v-if="searchOpen"
                class="-z-10 mr-2 h-full w-64"
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
        </div>
      </div>
    </nav>
    <PDrawer
      v-model:visible="drawer"
      block-scroll
      unstyled
      class="fixed left-0 top-0 h-full w-9/12 bg-white shadow-lg dark:bg-neutral-800"
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
        <div class="flex items-center justify-end p-2">
          <button
            @click="closeCallback"
            class="rounded bg-white p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-neutral-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <Icon name="lucide:x" />
          </button>
        </div>
        <main class="flex h-full flex-col p-4">
          <!-- <SidebarNavigator /> -->
          <div class="flex h-full flex-col">
            <NuxtLink
              to="/"
              @click="closeCallback"
              class="text-xl font-semibold text-primary-500"
              >Inicio</NuxtLink
            >
            <NuxtLink
              to="/portal/extras/config"
              @click="closeCallback"
              class="text-xl font-semibold text-primary-500"
              >About</NuxtLink
            >
          </div>
          <footer>here goes footer</footer>
        </main>
      </template>
    </PDrawer>

    <div class="d-flex flex-column">
      <main id="appcont" class="mx-auto max-w-screen-xl px-4 pt-16 lg:px-8">
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
import { useConfigsStore } from '~/stores/config'
import { type User } from '~/stores/regular-auth'
import { type Staff } from '~/stores/staff-auth'

const { user, role } = storeToRefs(useAuthStore())

const drawer = ref(false)
const router = useRouter()

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
    //normalize search
    search.value = ''
    await nextTick()
    $search.value.$input.$el.focus()
  }
}
const handleSearch = () => {
  if (search.value) {
    search.value = search.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    router.push({ name: 'portal-general-busqueda', query: { q: search.value } })
    searchOpen.value = false
    search.value = ''
  }
}
</script>
<style lang="postcss">
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
