<template>
  <CMessage
    v-if="error && error.statusCode === 500"
    title="Publicaciones no disponible"
    subtitle="Lo sentimos, parece que este contenido no está disponible en este momento, por favor intenta más tarde."
    backToLabel="Regresar al portal"
    backToRoute="/"
  />
  <div
    class="grid grid-cols-1 gap-6 pb-12 transition md:grid-cols-2 lg:grid-cols-2"
    v-if="!data && status === 'pending'"
  >
    <div
      v-for="index in 4"
      :key="index"
      class="group bg-surface-50 flex flex-col gap-12 rounded-xl border border-black p-5 transition active:translate-x-1 active:translate-y-1 dark:bg-neutral-900 dark:hover:bg-zinc-700/60"
    >
      <div class="flex-1 animate-pulse space-y-6">
        <div class="h-6.5 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="h-12 w-full rounded bg-neutral-200 dark:bg-neutral-700"></div>
      </div>
      <div class="h-4 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"></div>
    </div>
  </div>
  <CInfiniteScroll @load-more="load" v-if="data">
    <div
      class="grid grid-cols-1 gap-6 pb-12 transition md:grid-cols-2 lg:grid-cols-2"
      :class="{ 'opacity-50': status === 'pending' }"
    >
      <NuxtLink
        v-for="(item, index) in data"
        :key="index"
        class="group bg-surface-50 hover:bg-primary-50 flex flex-col gap-2 rounded-xl border border-black p-5 transition active:translate-x-1 active:translate-y-1 dark:bg-neutral-900 dark:hover:bg-zinc-700/60"
        :to="`/portal/post/${item.link}`"
      >
        <div class="flex-1 space-y-3">
          <h1 class="text-xl font-semibold">{{ item.title }}</h1>
          <p class="text-muted-color-emphasis">{{ item.description }}</p>
        </div>
        <small class="text-muted-color block">{{ item.posted_since }}</small>
        <span class="text-primary-emphasis-alt">
          Leer
          <Icon
            name="icon-park-outline:arrow-right"
            class="mb-0.5 inline-block transition-transform group-hover:translate-x-1"
          />
        </span>
      </NuxtLink>
    </div>
  </CInfiniteScroll>
</template>
<script setup lang="ts">
import CMessage from '../partials/CMessage.vue'
import CInfiniteScroll from '../primitives/data/CInfiniteScroll.vue'

const page = ref(1)
const { data, status, error } = useFetch<
  {
    title: string
    description: string
    link: string
    original_link: string
    posted_since: string
  }[]
>('/api/official-posts', {
  params: { page: page.value }
})

async function load() {
  status.value = 'pending'
  const res = await $fetch<
    {
      title: string
      description: string
      link: string
      original_link: string
      posted_since: string
    }[]
  >('/api/official-posts', {
    params: { page: page.value + 1 }
  })

  data.value?.push(...res)
  status.value = 'success'
  page.value++
}
</script>
