<template>
  <NavigationMenuRoot
    v-model="currentTrigger"
    class="relative z-[1] hidden justify-center lg:flex lg:w-auto"
  >
    <NavigationMenuList class="flex w-full gap-x-1">
      <NavigationMenuItem>
        <NavigationMenuLink
          as-child
          class="focus-visible:outline-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/50 active:bg-primary-300 my-auto block h-full rounded-md px-3 py-1.5 font-medium transition outline-none select-none focus-visible:outline focus-visible:outline-offset-2"
        >
          <NuxtLink to="/"> Inicio </NuxtLink>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem
        v-for="item in DefaultLayoutItems"
        :key="item.sectionName"
      >
        <NavigationMenuTrigger
          class="group hover:bg-primary-200 dark:hover:bg-primary-800/50 focus-visible:outline-primary-300 active:bg-primary-300 data-[state=open]:bg-primary-200 dark:data-[state=open]:bg-primary-800/50 flex items-center justify-between gap-2 rounded-md px-3 py-1.5 font-medium transition select-none focus-visible:outline focus-visible:outline-offset-2"
        >
          {{ item.shortName }}
          <Icon
            name="lucide:chevron-down"
            class="relative top-px transition-transform duration-150 ease-in group-data-[state=open]:-rotate-180"
          />
        </NavigationMenuTrigger>
        <NavigationMenuContent
          class="data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft absolute top-0 left-0 w-full"
        >
          <div class="px-5 pt-4 pb-5">
            <h3 class="pb-3 text-lg font-semibold">{{ item.sectionName }}</h3>
            <ul class="flex flex-col gap-1">
              <li v-for="sectItem in item.items" :key="sectItem.itemName">
                <NuxtLink
                  :to="sectItem.itemLink"
                  active-class="active-menu"
                  class="menu-item"
                >
                  <Icon :name="sectItem.itemIcon" />

                  {{ sectItem.itemName }}</NuxtLink
                >
              </li>
            </ul>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>

    <div class="absolute top-full flex w-[30rem] justify-center">
      <NavigationMenuViewport
        class="bg-cics-white data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn relative mt-4 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-xl border border-black/80 shadow-lg shadow-black/15 transition-[height] duration-200 dark:bg-neutral-900"
      />
    </div>
  </NavigationMenuRoot>
</template>
<script setup lang="ts">
import { DefaultLayoutItems } from '~/layouts/default.consts'

const currentTrigger = defineModel({
  type: String,
  required: true
})
</script>
<style scoped>
@reference '~/assets/css/main.css';

.menu-item {
  @apply text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:hover:text-primary-300 dark:hover:before:bg-primary-200 relative flex items-center gap-x-2 rounded-lg py-2 pr-2 pl-8 font-medium ring ring-transparent  transition duration-200 before:absolute before:top-1/2 before:left-4 before:h-[calc(100%+4px)] before:w-0.5 before:-translate-y-1/2 before:rounded before:bg-gray-300 dark:bg-neutral-900 dark:before:bg-neutral-700 inset-ring inset-ring-transparent before:transition;
}

.active-menu {
  @apply text-primary-700 focus:text-primary-500 active:text-primary-500 dark:text-primary-500 before:bg-primary-700 before:dark:bg-primary-400 z-50 shadow-md 
  ring-gray-800 dark:ring-neutral-600 
  transition before:absolute before:top-1/2 before:left-4 before:h-2/4 before:w-0.5 before:-translate-y-1/2 before:rounded hover:inset-ring-1 hover:inset-ring-gray-800  dark:hover:inset-ring-neutral-600;
  /* &::before {
    @apply bg-primary-700 dark:bg-primary-400 absolute top-1/2 left-4 h-2/4 w-0.5 -translate-y-1/2 rounded;
    content: '';
  } */
}
</style>
