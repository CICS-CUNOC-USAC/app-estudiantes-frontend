<template>
  <ContentDisplay :data />
</template>

<script lang="ts" setup>
import ContentDisplay from '~/components/portal/ContentDisplay.vue';

const { data } = await useAsyncData(() =>
  queryContent('associations')
    .where({
      _path: { $contains: '/associations/aeio' }
    })
    // .without(['body'])
    .findOne()
)

useCustomPageTitle(data.value?.title)
</script>