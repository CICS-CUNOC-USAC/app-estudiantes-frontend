<template>
  <CInfiniteScroll @load-more="load" v-if="data">
    <div
      class="grid grid-cols-1 gap-3 pb-12 transition md:grid-cols-2 lg:grid-cols-2"
      :class="{ 'opacity-50': isLoading }"
    >
      <NuxtLink
        v-for="(item, index) in data"
        :key="index"
        class="group flex flex-col gap-2 rounded-xl border border-transparent p-5 transition hover:bg-slate-100 active:translate-x-1 active:translate-y-1 dark:hover:bg-zinc-700/60"
        :to="`/portal/post/${item.link}`"
      >
        <div class="flex-1 space-y-3">
          <h1 class="text-xl font-bold">{{ item.title }}</h1>
          <p class="text-muted-color-emphasis">{{ item.description }}</p>
        </div>
        <small class="block text-muted-color">{{ item.posted_since }}</small>
        <span class="text-primary-emphasis-alt">
          Leer
          <Icon
            name="lucide:arrow-right"
            class="mb-0.5 inline-block transition-transform group-hover:translate-x-1"
          />
        </span>
      </NuxtLink>
    </div>
  </CInfiniteScroll>
</template>
<script setup lang="ts">
import CInfiniteScroll from '../primitives/data/CInfiniteScroll.vue'

const page = ref(1)
const { data } = useFetch<
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
  // page.value++
}
</script>
<style lang="scss" scoped></style>
