<template>
  <template v-if="data">
    <v-infinite-scroll @load="load">
      <v-row>
        <v-col
          v-for="(item, index) in data"
          :key="index"
          cols="12"
          xs="12"
          sm="12"
          lg="6"
        >
          <CCard
            :title="item.title"
            :description="item.description"
            :link="`/portal/post/${item.link}`"
            :small="item.posted_since"
          />
        </v-col>
      </v-row>
    </v-infinite-scroll>
  </template>
</template>
<script setup lang="ts">
import CCard from '../primitives/card/CCard.vue'

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

// eslint-disable-next-line @typescript-eslint/ban-types
async function load({ done }: { done: Function }) {
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
  //@ts-expect-error done is a function
  data.value = [...data.value, ...res]
  page.value++
  done('ok')
}
</script>
<style lang="scss" scoped></style>
