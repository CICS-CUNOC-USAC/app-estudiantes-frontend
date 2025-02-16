<template>
  <ContentDisplay :data />
</template>

<script lang="ts" setup>
import ContentDisplay from '~/components/portal/ContentDisplay.vue';

const { data } = await useAsyncData(() =>
  queryCollection('associations').where('path', 'LIKE', '%/aeio').first()
)

useCustomPageTitle(data.value?.title)
</script>