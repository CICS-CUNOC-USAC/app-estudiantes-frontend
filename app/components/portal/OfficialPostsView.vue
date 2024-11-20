<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div v-for="(item, index) in data" :key="index" class="col-span-1">
      <CCardAlt
        class="hover:bg-primary-100/75"
        interactive-inverse
        :title="item.title"
        :description="item.description"
        :to="`/portal/post/${item.link}`"
        :small="item.posted_since"
      >
      <template #footer>
        <span class="inline-flex items-center text-sm tracking-tight text-primary-400 gap-x-2">
            Leer más
            <Icon name="lucide:arrow-right" />
        </span>
      </template>
    </CCardAlt>
    </div>
  </div>
</template>
<script setup lang="ts">
import CCardAlt from '../primitives/card/CCardAlt.vue';

const { data } = useFetch<
  {
    title: string
    description: string
    link: string
    original_link: string
    posted_since: string
  }[]
>('/api/official-posts')
</script>
<style lang="scss" scoped></style>
