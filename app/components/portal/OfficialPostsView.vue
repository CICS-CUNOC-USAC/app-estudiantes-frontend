<template>
  <v-row>
    <v-col
      v-for="(item, index) in data"
      :key="index"
      cols="12"
      xs="12"
      sm="12"
      lg="4"
    >
      <InfoCard
        full-height
        :title="item.title"
        :description="item.description"
        :route="`/portal/post/${item.link}`"
      />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import InfoCard from '../cards/InfoCard.vue'

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
