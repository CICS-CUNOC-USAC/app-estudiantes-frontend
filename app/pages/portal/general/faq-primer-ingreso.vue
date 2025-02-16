<template>
  <ContentDisplay :data />
</template>

<script lang="ts" setup>
import ContentDisplay from '~/components/portal/ContentDisplay.vue';

const { data } = await useAsyncData(() =>
  queryCollection('faq').where('path', 'LIKE', '%/primer-ingreso').first()
)
useCustomPageTitle(data.value?.title)
</script>