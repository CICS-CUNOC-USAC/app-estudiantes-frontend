<template>
  <!-- <ContentDisplay :data /> -->
  <div class="mx-auto content-renderer">
    <StrapiBlocks :content="data?.data.content" />
  </div>
</template>
<script lang="ts" setup>
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
const { data } = await useAsyncData('about', () => $strapi('/about'))
</script>
<style>
@reference '~/assets/css/main.css';


</style>