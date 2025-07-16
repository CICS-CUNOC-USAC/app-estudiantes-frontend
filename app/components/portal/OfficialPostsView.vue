<template>
  <!-- v-if="status === 'pending'" -->
  <template v-if="status === 'pending'">
    <div class="flex h-32 items-center justify-center gap-4">
      <Icon name="svg-spinners:bars-rotate-fade" />
      Obteniendo publicaciones oficiales...
    </div>
  </template>
  <template v-if="data && status === 'success'">
    <section class="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div v-for="(item, index) in data" :key="index" class="col-span-1">
        <CCardAlt
          class="group hover:bg-primary-100/75 dark:hover:bg-primary-900/30"
          interactive-inverse
          :title="item.title"
          :description="item.description"
          :to="`/portal/post/${item.link}`"
          :small="item.posted_since"
        >
          <template #footer>
            <span
              class="up text-primary-800 dark:text-primary-300 inline-flex items-center gap-x-2 text-xs font-medium tracking-tight"
            >
              Ver publicación
              <Icon
                name="icon-park-outline:arrow-right"
                class="transition group-hover:translate-x-1"
              />
            </span>
          </template>
        </CCardAlt>
      </div>
    </section>
  </template>
  <template v-else-if="status === 'error'">
    <div class="flex h-32 items-center justify-center gap-4 text-red-500">
      <Icon name="icon-park-twotone:caution" />
      No pudimos obtener las ultimas publicaciones. Por favor intenta más tarde.
    </div>
  </template>
</template>
<script setup lang="ts">
import CCardAlt from '../primitives/card/CCardAlt.vue'

const { data, status } = useFetch<
  {
    title: string
    description: string
    link: string
    original_link: string
    posted_since: string
  }[]
>('/api/official-posts', {
  default: () => [],
  getCachedData: (key, nuxtApp) => {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  }
})
</script>
