<template>
  <ContentDisplay :data />
</template>

<script lang="ts" setup>
import ContentDisplay from '~/components/portal/ContentDisplay.vue';

const { data } = await useAsyncData(() =>
  queryContent('faq')
    .where({
      _path: { $contains: '/faq/primer-ingreso' }
    })
    // .without(['body'])
    .findOne()
)
useCustomPageTitle(data.value?.title)
</script>