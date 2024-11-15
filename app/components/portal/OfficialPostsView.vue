<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div v-for="(item, index) in data" :key="index" class="col-span-1">
      <CCard
        :title="item.title"
        :description="item.description"
        :link="`/portal/post/${item.link}`"
        :small="item.posted_since"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CCard from '../primitives/card/CCard.vue';

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
