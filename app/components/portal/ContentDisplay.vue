<template>
  <div class="relative flex flex-col items-start gap-4 lg:flex-row lg:gap-12">
    <div class="sticky top-20 hidden w-3/12 self-start lg:block print:hidden">
      <h4 class="mb-2 text-xl font-semibold">Secciones</h4>
      <ul
        class="space-y-2.5 border-l-2 border-gray-200 dark:border-neutral-700"
      >
        <li
          v-for="link of data?.body?.toc?.links"
          :key="link.id"
          :class="{
            // 'ml-2': link.depth === 2,
            'ml-2': link.depth === 3
          }"
          class="hover:text-primary-600 dark:hover:text-primary-300 text-sm"
        >
          <NuxtLink :to="`#${link.id}`" class="toc-item" v-slot="slotProps">
            <!-- <Icon
                name="lucide:arrow-right"
                size="12"
                class="mb-1 mr-1 inline text-muted-color-emphasis"
              /> -->

            {{ link.text }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <PopoverRoot>
      <PopoverTrigger
        class="hover:text-primary-600 dark:hover:text-primary-300 lg:hidden print:hidden"
        aria-label="Navegación"
      >
        <Icon
          name="lucide:chevron-down"
          class="text-muted-color-emphasis mr-2 mb-1 inline"
        />
        En esta página
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          side="bottom"
          :side-offset="10"
          class="ml-5 w-2/3 rounded-xl border border-black bg-white p-4 shadow-md dark:bg-neutral-900"
        >
          <div class="max-h-80 overflow-y-auto">
            <h3 class="mb-4 text-xl font-semibold">Secciones</h3>
            <ul
              class="space-y-2.5 border-l-2 border-gray-200 dark:border-neutral-700"
            >
              <li
                v-for="link of data?.body?.toc?.links"
                :key="link.id"
                :class="{
                  // 'ml-2': link.depth === 2,
                  'ml-2': link.depth === 3
                }"
                class="hover:text-primary-600 dark:hover:text-primary-300 text-sm"
              >
                <NuxtLink
                  :to="`#${link.id}`"
                  class="toc-item"
                  v-slot="slotProps"
                >
                  {{ link.text }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
    <h1 class="text-muted-color-emphasis hidden italic print:block">
      Manual - <span class="font-bold">Portal CICS App</span>
    </h1>
    <div class="content-renderer" v-if="data">
      <ContentRenderer :value="data" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'

const props = defineProps<{
  data?: ParsedContent | null
}>()
</script>
<style>
@reference '~/assets/css/main.css';

.toc-item {
  @apply text-muted-color relative flex items-center rounded-lg py-px pr-2 pl-4 font-medium transition-all duration-200 before:absolute before:top-1/2 before:-left-0.5 before:h-full before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-transparent hover:text-black hover:before:bg-black dark:bg-transparent before:dark:bg-neutral-700 dark:hover:text-white dark:hover:before:bg-white;

  /* &::before {
    @apply absolute -left-[2px] top-1/2 h-full w-0.5 -translate-y-1/2 rounded-full bg-transparent dark:bg-neutral-700;
    content: '';
  } */
}

.content-renderer {
  @apply prose dark:prose-invert dark:print:prose prose-headings:my-2 prose-h1:text-2xl prose-h1:font-bold prose-h2:text-xl prose-hr:my-6 prose-hr:border-gray-200 dark:prose-hr:border-zinc-700 mx-auto max-w-none lg:w-9/12;

  @apply prose-a:border-b prose-a:border-primary-500 prose-a:font-semibold prose-a:no-underline prose-a:transition prose-a:hover:border-b-2;

  @apply prose-a:hover:text-color-emphasis dark:prose-a:hover:text-primary-100;

  @apply prose-a:prose-headings:border-b-0 prose-a:prose-headings:border-primary-500 prose-a:hover:prose-headings:border-b;
}
</style>
