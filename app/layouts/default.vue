<template>
  <div>
    <nav
      class="fixed top-0 z-20 h-14 w-full border-b backdrop-blur-sm transition-shadow print:hidden"
      :class="{
        'border-transparent': !hasScrolled,
        'border-neutral-200 shadow-md dark:border-black/75': hasScrolled,
        'dark:bg-surface-800/75 bg-white/80': !$route.meta.menuClass,
        [$route.meta.menuClass as string]: $route.meta.menuClass
      }"
    >
      <div
        class="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 py-2.5"
      >
        <div class="flex grow basis-0 items-center gap-x-3">
          <button
            @click="drawer = !drawer"
            type="button"
            class="hover:bg-primary-100 dark:hover:bg-primary-900/70 inline-flex size-9 items-center justify-center rounded-lg p-1 text-sm text-gray-500 focus:ring-2 focus:ring-neutral-200 focus:outline-none lg:hidden dark:text-neutral-400 dark:focus:ring-neutral-600"
          >
            <Icon name="tabler:layout-sidebar-filled" />
          </button>
          <NuxtLink
            class="hidden items-center space-x-2 transition hover:opacity-80 lg:flex"
            to="/"
          >
            <CICSLogo :width="60" fill="var(--p-primary-500)" />
            <span v-if=" $route.meta.title">⋅</span>
            <div class="text-xs font-medium">{{ $route.meta.title }}</div>
          </NuxtLink>
          <Transition name="title-fade">
            <NuxtLink class="block text-sm lg:hidden" to="/" v-if="!searchOpen">
              <strong>CICS App</strong> ⋅ Portal
              <div class="text-xs font-medium">{{ $route.meta.title }}</div>
            </NuxtLink>
          </Transition>
        </div>

        <TopNavDesktopDashboard v-model="currentTrigger" />

        <div class="relative flex grow basis-0 justify-end gap-x-1">
          <div class="flex items-center">
            <Transition name="fade-slide">
              <form
                v-if="searchOpen"
                class="mr-2 h-full w-64 md:max-xl:w-44"
                @submit.prevent="handleSearch"
              >
                <CInputText
                  :clear-button="true"
                  v-model="search"
                  type="search"
                  ref="$search"
                  placeholder="Buscar en Ingeniería CUNOC"
                  fill-height
                />
              </form>
            </Transition>
            <CButton
            class="px-2!"
              v-Ptooltip.bottom="'(Ctrl/Cmd + K) Buscar en Ingeniería CUNOC'"
              :icon="
                searchOpen
                  ? 'icon-park-twotone:close-one'
                  : 'icon-park-twotone:search'
              "
              @click="toggleSearch"
            />
          </div>

          <CButton
            v-if="!searchOpen"
            icon="icon-park-twotone:people"
            :to="user ? '/dashboard/home' : '/login'"
            :label="user ? displayName : 'Ingresar'"
            class="max-w-[13ch] min-w-0 !px-2"
            pt:label:class="hidden lg:block truncate"
            v-Ptooltip.bottom="`Ir a mi espacio`"
          />
        </div>
      </div>
    </nav>

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
            class: `bg-surface-900/50 transition-all duration-500 ${options.props.visible ? 'mask-enter' : 'mask-leave'}`
          }
        }
      }"
    >
      <template #container="{ closeCallback }">
        <SidebarNavigator @close="closeCallback" />
      </template>
    </PDrawer>

    <div class="d-flex flex-column">
      <main
        id="appcont"
          class="mx-auto print:pt-14  min-h-screen"
        :class="{
          'max-w-screen-xl px-5 pt-20 lg:px-8': !$route.meta.extendScreen,
        }"
      >
        <NuxtPage @search="toggleSearch({ leaveOpen: true })" keepalive />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CICSLogo from '~/components/partials/CICSLogo.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { useAuthStore } from '~/stores/auth'
import TopNavDesktopDashboard from '~/components/partials/navigation/TopNavDesktopDashboard.vue'
import SidebarNavigator from '~/components/partials/SidebarNavigator.vue'

const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

// const { meta } = useRoute()

const drawer = ref(false)

const hasScrolled = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    hasScrolled.value = window.scrollY > 30
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => {
    hasScrolled.value = window.scrollY > 30
  })
})

const { meta, k, control } = useMagicKeys()

watchEffect(() => {
  if ((meta.value || control.value) && k.value) {
    toggleSearch({ leaveOpen: false })
  }
})

const currentTrigger = ref('')

const searchOpen = ref(false)
const search = ref('')
const $search = ref(null)
const toggleSearch = async ({ leaveOpen = false }: { leaveOpen: boolean }) => {
  if (leaveOpen && searchOpen.value) {
    $search.value.$input.$el.focus()
    return
  }
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
