<template>
  <main class="">
    <nav class="mb-4 space-x-4">
      <CButton
        icon="lucide:arrow-left"
        variant="link"
        label="Regresar a manuales"
        class="mb-4 text-muted-color-emphasis lg:mb-2"
        to="/portal/recursos/manuales"
      />
      <CButton
        icon="lucide:house"
        variant="link"
        label="Ir al inicio"
        class="mb-4 text-muted-color-emphasis lg:mb-2"
        to="/"
      />
    </nav>
    <div class="relative flex flex-col items-start gap-4 lg:flex-row lg:gap-12">
      <div class="sticky top-20 hidden w-3/12 self-start lg:block">
        <h4 class="mb-2 text-xl font-semibold">Tabla de contenidos</h4>
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
            class="text-sm hover:text-primary-600 dark:hover:text-primary-300"
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
          class="hover:text-primary-600 lg:hidden dark:hover:text-primary-300"
          aria-label="Navegación"
        >
          <Icon
            name="lucide:chevron-down"
            class="mb-1 mr-2 inline text-muted-color-emphasis"
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
              <h3 class="mb-4 text-xl font-semibold">Tabla de contenidos</h3>
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
                  class="text-sm hover:text-primary-600 dark:hover:text-primary-300"
                >
                  <NuxtLink
                    :to="`#${link.id}`"
                    class="toc-item"
                    v-slot="slotProps"
                  >
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
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
      <div class="content-renderer" v-if="data">
        <ContentRenderer :value="data" />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'

const route = useRoute()

const { data } = await useAsyncData(() =>
  queryContent('manuals')
    .where({
      _path: { $contains: route.params.manualId }
    })
    .findOne()
)
</script>
<style lang="postcss">
.toc-item {
  @apply relative flex items-center rounded-lg py-px pl-4 pr-2 font-medium transition-all duration-200 text-muted-color hover:text-black hover:before:bg-black dark:bg-neutral-800 dark:hover:text-white hover:before:dark:bg-white;
  &::before {
    @apply absolute -left-[2px] top-1/2 h-full w-0.5 -translate-y-1/2 rounded-full bg-transparent dark:bg-neutral-700;
    content: '';

    /* Comment if no animation is needed */
    /* @apply transition-all duration-100 ease-in-out; */
  }
}

.content-renderer {
  @apply prose mx-auto max-w-none dark:prose-invert prose-headings:my-2 prose-h1:text-2xl prose-h1:font-bold prose-h2:text-xl prose-hr:my-6 lg:w-9/12;

  @apply prose-a:border-b prose-a:border-primary-500 prose-a:font-semibold prose-a:no-underline prose-a:transition hover:prose-a:border-b-2;

  @apply hover:prose-a:text-color-emphasis dark:hover:prose-a:text-primary-100;

  @apply prose-a:prose-headings:border-b-0 prose-a:prose-headings:border-primary-500 hover:prose-a:prose-headings:border-b;
}
</style>
