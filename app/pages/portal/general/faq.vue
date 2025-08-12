<template>
  <!-- <ContentDisplay :data /> -->
  <div class="mx-auto content-renderer" v-if="data?.data.content">
    <StrapiBlocks :content="data?.data.content" />
  </div>
</template>
<script lang="ts" setup>
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
const { data } = await useAsyncData('faq', () => $strapi('/faq'))
</script>
<style>
@reference '~/assets/css/main.css';
</style>