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
    <div class="flex relative gap-4 lg:gap-12 flex-col lg:flex-row items-start">
      <div class="sticky top-20 hidden w-3/12 self-start lg:block">
        <h4 class="mb-2 text-xl font-semibold">
          Tabla de contenidos</h4>
        <ul class="space-y-2">
          <li
            v-for="link of data?.body?.toc?.links"
            :key="link.id"
            :class="{ toc2: link.depth === 2, toc3: link.depth === 3 }"
            class="hover:text-primary-600 dark:hover:text-primary-300"
          >
            <Icon
              name="lucide:chevron-right"
              class="mb-1 mr-2 inline text-muted-color-emphasis"
            />
            <NuxtLink :to="`#${link.id}`">{{ link.text }}</NuxtLink>
          </li>
        </ul>
      </div>
      <PopoverRoot >
        <PopoverTrigger class="lg:hidden hover:text-primary-600 dark:hover:text-primary-300"
         aria-label="Navegación">
          <Icon
            name="lucide:chevron-down"
            class="mr-2 mb-1 text-muted-color-emphasis inline"
          /> En esta página
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent
            side="bottom"
            :side-offset="10"
            class="ml-5 w-8/12 rounded-xl border border-black bg-white p-4 shadow-md dark:bg-neutral-900"
          >
            <div>
              <h3 class="text-xl font-semibold mb-4">Tabla de contenidos</h3>
              <ul class="space-y-3">
                <li
                  v-for="link of data?.body?.toc?.links"
                  :key="link.id"
                  :class="{ toc2: link.depth === 2, toc3: link.depth === 3 }"
                  class="hover:text-primary-600 dark:hover:text-primary-300"
                >
                  <Icon
                    name="lucide:chevron-right"
                    class="mb-1 mr-2 inline text-muted-color-emphasis"
                  />
                  <NuxtLink :to="`#${link.id}`">{{ link.text }}</NuxtLink>
                </li>
              </ul>
            </div>
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
      <div class="manual-content" v-if="data">
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
<style lang="postcss" scoped>
.manual-content {
  @apply prose mx-auto max-w-none dark:prose-invert prose-headings:my-0 prose-hr:my-6 prose-h1:text-3xl
  ;

  @apply prose-a:border-b prose-a:border-primary-500 prose-a:font-semibold prose-a:no-underline prose-a:transition hover:prose-a:border-b-2;

  @apply hover:prose-a:text-color-emphasis dark:hover:prose-a:text-primary-100;

  @apply prose-a:prose-headings:border-b-0 prose-a:prose-headings:border-primary-500 hover:prose-a:prose-headings:border-b;
}
</style>
