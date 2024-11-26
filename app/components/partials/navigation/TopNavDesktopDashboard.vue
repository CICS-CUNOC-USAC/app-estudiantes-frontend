<template>
  <NavigationMenuRoot
    v-model="currentTrigger"
    class="relative z-[1] hidden justify-center lg:order-1 lg:flex lg:w-auto"
  >
    <NavigationMenuList class="flex w-full gap-x-1">
      <NavigationMenuItem>
        <NavigationMenuLink
          as-child
          class="my-auto block h-full select-none rounded-md px-3 py-1.5 font-medium outline-none transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/50 active:bg-primary-300"
        >
          <NuxtLink to="/"> Inicio </NuxtLink>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem
        v-for="item in DefaultLayoutItems"
        :key="item.sectionName"
      >
        <NavigationMenuTrigger
          class="group flex select-none items-center justify-between gap-2 rounded-md px-3 py-1.5 font-medium transition hover:bg-primary-200 dark:hover:bg-primary-800/50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-300 active:bg-primary-300"
        >
          {{ item.shortName }}
          <Icon
            name="lucide:chevron-down"
            class="relative top-px transition-transform duration-150 ease-in group-data-[state=open]:-rotate-180"
          />
        </NavigationMenuTrigger>
        <NavigationMenuContent
          class="absolute left-0 top-0 w-full data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft"
        >
          <div class="px-5 pb-5 pt-4">
            <h3 class="text-lg font-semibold pb-3">{{ item.sectionName }}</h3>
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
        class="relative mt-4 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl bg-cics-white dark:bg-neutral-900 shadow-lg shadow-black/15 outline outline-black/50 transition-[height] duration-200 data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn"
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
<style scoped lang="postcss">
.menu-item {
  @apply relative flex items-center gap-x-2 rounded-lg py-2 pl-8 pr-2 font-medium outline outline-transparent transition-all duration-200 text-muted-color-emphasis hover:text-primary-700 hover:before:bg-primary-700 dark:bg-neutral-900 dark:hover:text-primary-300 hover:before:dark:bg-primary-200;
  &::before {
    @apply absolute left-4 top-1/2 h-[calc(100%+4px)] w-0.5 -translate-y-1/2 bg-gray-300 dark:bg-neutral-700;
    content: '';

    /* Comment if no animation is needed */
    @apply transition-all duration-200 ease-in-out;
  }
}

.active-menu {
  @apply z-50 text-primary-700 shadow-md outline-gray-600 focus:text-primary-500 active:text-primary-500 dark:text-primary-500 dark:outline-neutral-600;
  &::before {
    @apply absolute left-4 top-1/2 h-2/4 w-0.5 -translate-y-1/2 rounded bg-primary-700 dark:bg-primary-400;
    content: '';
  }
}
</style>
