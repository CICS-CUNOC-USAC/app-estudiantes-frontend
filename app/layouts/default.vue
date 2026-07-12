<template>
  <SidebarProvider :default-open="false">
    
    <DefaultSidebar />
    <!-- <SidebarFloatingToggle /> -->
    <div class="w-full">
      
      <nav class="fixed top-0 z-20 w-full border-b backdrop-blur-sm transition-shadow print:hidden" :class="{
        'border-transparent': !hasScrolled,
        'border-neutral-200 shadow-md dark:border-neutral-700/75':
          hasScrolled,
        'dark:bg-surface-800/75 bg-white/80': !$route.meta.menuClass,
        [$route.meta.menuClass as string]: $route.meta.menuClass
      }">
        
        <CurrentAlert />

        <div class="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 py-3">
          
          <div class="flex grow basis-0 items-center gap-x-3">
            <div class="inline-flex lg:hidden">
              <SidebarTrigger class="px-2"> </SidebarTrigger>
            </div>
            <!-- <button
              type="button"
              class="hover:bg-primary-100 dark:hover:bg-primary-900/70 inline-flex size-9 items-center justify-center rounded-lg p-1 text-sm text-gray-500 focus:ring-2 focus:ring-neutral-200 focus:outline-none lg:hidden dark:text-neutral-400 dark:focus:ring-neutral-600"
            >
              <Icon name="tabler:layout-sidebar-filled" />
            </button> -->
            <NuxtLink class="hidden items-center space-x-2 transition hover:opacity-80 lg:flex" to="/">
              <CICSLogo :width="60" fill="var(--color-primary-500)" />
              <span v-if="$route.meta.title">⋅</span>
              <div class="text-xs font-medium">{{ $route.meta.title }}</div>
            </NuxtLink>
            <Transition name="title-fade">
              <NuxtLink class="block text-sm lg:hidden" to="/" v-if="!searchOpen">
                <strong>CICS App</strong> ⋅ Portal
                <div class="text-xs font-medium">{{ $route.meta.title }}</div>
              </NuxtLink>
            </Transition>
          </div>

          
          <TopNavDesktopDashboard v-model="currentTrigger" class="hidden lg:flex" />

          <div class="relative flex grow basis-0 justify-end gap-x-1">
            <div class="flex items-center">
              <Transition name="fade-slide">
                <form v-if="searchOpen" class="mr-2 h-full w-64 md:max-xl:w-44" @submit.prevent="handleSearch">
                  <CInputText :clear-button="true" v-model="search" type="search" ref="$search"
                    placeholder="Buscar en Ingeniería CUNOC" fill-height />
                </form>
              </Transition>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button class="px-2" :icon="searchOpen
                        ? 'icon-park-twotone:close-one'
                        : 'icon-park-twotone:search'
                      " @click="toggleSearch" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Buscar en Ingeniería CUNOC</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button v-if="!searchOpen" icon="icon-park-twotone:people" size="small"
                    :to="user ? '/dashboard/home' : '/login'" :label="user ? 'Espacio' : 'Ingresar'" class="min-w-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {{
                      user
                        ? `Sesión iniciada como ${displayNameFull}`
                        : 'Iniciar sesión para acceder a tu espacio personal'
                    }}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </nav>

      <!-- <PDrawer
      v-model:visible="drawer"
      block-scroll
      unstyled
      class="bg-cics-white dark:bg-surface-800 h-full w-10/12 shadow-lg md:w-5/12"
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
</PDrawer> -->

      <div class="d-flex flex-column">
        <main id="appcont" class="mx-auto min-h-screen print:pt-14 " :class="{
          'max-w-7xl pt-20 px-5 lg:px-8': !$route.meta.extendScreen
        }">
        
          <NuxtPage @search="toggleSearch({ leaveOpen: true })" keepalive />
        </main>
      </div>
    </div>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import CurrentAlert from '~/components/dashboard/CurrentAlert.vue'
import CICSLogo from '~/components/partials/CICSLogo.vue'
import DefaultSidebar from '~/components/partials/navigation/DefaultSidebar.vue'
import TopNavDesktopDashboard from '~/components/partials/navigation/TopNavDesktopDashboard.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import Button from '~/components/ui/button/Button.vue'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'

import { useAuthStore } from '~/stores/auth'

type CInputTextInstance = InstanceType<typeof CInputText>

const { user, displayName, displayNameFull, getRole } =
  storeToRefs(useAuthStore())

const { hasScrolled } = useNavScrollShadow()

const currentTrigger = ref('')

const searchOpen = ref(false)
const search = ref('')
const $search = ref<CInputTextInstance | null>(null)
const toggleSearch = async ({ leaveOpen = false }: { leaveOpen: boolean }) => {
  if (leaveOpen && searchOpen.value) {
    $search.value?.focus()
    return
  }
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    search.value = ''
    await nextTick()
    $search.value?.focus()
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
