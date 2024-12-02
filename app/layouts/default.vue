<template>
  <div>
    <nav
      class="fixed top-0 z-20 h-14 w-full border-surface-300 bg-cics-white/80 backdrop-blur-sm transition dark:border-neutral-700 dark:bg-surface-800/80"
      :class="{
        'border-b shadow-md': hasScrolled
      }"
    >
      <div
        class="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-2.5"
      >
        <div class="flex grow basis-0 items-center gap-x-3">
          <button
            @click="drawer = !drawer"
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-lg p-1 text-sm text-gray-500 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 md:hidden dark:text-neutral-400 dark:hover:bg-primary-900/70 dark:focus:ring-neutral-600"
          >
            <Icon name="tabler:layout-sidebar-filled" />
          </button>
          <button
            class="hidden items-center space-x-3 transition hover:opacity-80 md:flex"
            to="/"
            @click="drawer = true"
          >
            <CICSLogo :width="60" fill="var(--p-primary-500)" />
          </button>
          <Transition name="title-fade">
            <NuxtLink class="block text-sm md:hidden" to="/" v-if="!searchOpen">
              <strong>CICS App</strong> ⋅ Portal
            </NuxtLink>
          </Transition>
        </div>

        <TopNavDesktopDashboard v-model="currentTrigger" />

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
        <SidebarNavigator @close="closeCallback" />
      </template>
    </PDrawer>

    <div class="d-flex flex-column">
      <main id="appcont" class="mx-auto max-w-screen-xl px-5 pt-20 lg:px-8">
        <NuxtPage @search="toggleSearch({ leaveOpen: true })" />
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
import TopNavDesktopDashboard from '~/components/partials/navigation/TopNavDesktopDashboard.vue'
import SidebarNavigator from '~/components/partials/SidebarNavigator.vue'

const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

const drawer = ref(false)

const hasScrolled = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    hasScrolled.value = window.scrollY > 30
  })
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
