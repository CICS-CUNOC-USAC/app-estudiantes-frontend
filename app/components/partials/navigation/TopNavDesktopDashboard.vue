<template>
  <NavigationMenu  :viewport="false">
    <NavigationMenuList class="flex w-full gap-x-1">
      <NavigationMenuItem>
        <NavigationMenuLink
          as-child
          :class="navigationMenuTriggerStyle()"
          class="hover:bg-primary-100 dark:hover:bg-primary-900 data-[state=open]:bg-primary-100! data-[state=open]:dark:bg-primary-900! bg-transparent focus:bg-transparent focus:ring-2 focus:ring-primary-500 focus:outline-none"
        >
          <NuxtLink to="/"> Inicio </NuxtLink>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem
        v-for="item in DefaultLayoutItems"
        :key="item.sectionName"
      >
        <NavigationMenuTrigger
          class="hover:bg-primary-100 dark:hover:bg-primary-900 data-[state=open]:bg-primary-100! data-[state=open]:dark:bg-primary-900! bg-transparent focus:bg-transparent focus:ring-2! focus:ring-primary-500! focus:outline-none"
        >
          {{ item.shortName }}
        </NavigationMenuTrigger>
        <NavigationMenuContent class="left-1/2 -translate-x-1/2">
          <div class="w-[380px] px-5 pt-4 pb-5">
            <h3 class="pb-3 text-lg font-semibold">{{ item.sectionName }}</h3>
            <ul class="flex flex-col gap-1">
              <li v-for="sectItem in item.items" :key="sectItem.itemName">
                <NuxtLink
                  :to="sectItem.itemLink"
                  active-class="active-menu"
                  class="menu-item"
                >
                  <Icon :name="sectItem.itemIcon" />
                  {{ sectItem.itemName }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '~/components/ui/navigation-menu'
import { DefaultLayoutItems } from '~/layouts/default.consts'

</script>

<style scoped>
@reference '~/assets/css/main.css';

.menu-item {
  @apply text-muted-foreground hover:text-primary-700 hover:before:bg-primary-700 dark:hover:text-primary-300 dark:hover:before:bg-primary-200 dark:bg-surface-900 relative flex items-center gap-x-2 rounded-lg py-2 pr-2 pl-8 font-medium ring inset-ring ring-transparent inset-ring-transparent transition duration-200 before:absolute before:top-1/2 before:left-4 before:h-[calc(100%+4px)] before:w-0.5 before:-translate-y-1/2 before:rounded before:bg-gray-300 before:transition dark:before:bg-neutral-700;
}

.active-menu {
  @apply text-primary-700 focus:text-primary-500 active:text-primary-500 dark:text-primary-500 before:bg-primary-700 before:dark:bg-primary-400 z-50 shadow-md ring-gray-800 transition before:absolute before:top-1/2 before:left-4 before:h-2/4 before:w-0.5 before:-translate-y-1/2 before:rounded hover:inset-ring-1 hover:inset-ring-gray-800 dark:ring-neutral-600 dark:hover:inset-ring-neutral-600;
}
</style>
