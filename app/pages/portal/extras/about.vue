<template>
  <ContentDisplay :data />
</template>

<script lang="ts" setup>
import ContentDisplay from '~/components/portal/ContentDisplay.vue';

const { data } = useAsyncData(() =>
queryCollection('extra').where('path', 'LIKE', '%/about').first()
)
</script>
