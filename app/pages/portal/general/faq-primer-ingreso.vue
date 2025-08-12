<template>
  <!-- <ContentDisplay :data /> -->
  <div class="content-renderer mx-auto" v-if="data?.data.content">
    <StrapiBlocks :content="data?.data.content" />
  </div>
</template>
<script lang="ts" setup>
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
const { data } = await useAsyncData('faq-primer-ingreso', () =>
  $strapi('/faq-primer-ingreso')
)
</script>
<style>
@reference '~/assets/css/main.css';
</style>
