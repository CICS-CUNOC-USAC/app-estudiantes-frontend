<template>
  <!-- <ContentDisplay :data /> -->
  <div class="mx-auto content-renderer" v-if="data">
    <StrapiBlocks :content="data?.data.content" />
  </div>
</template>
<script lang="ts" setup>
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
const { data } = await useAsyncData('aeio-aso', () => $strapi('/aeio-aso'))
</script>
<style lang="css">
@reference '~/assets/css/main.css';

</style>