<template>
  <!-- <ContentDisplay :data /> -->
  <div class="mx-auto content-renderer" v-if="data">
    <StrapiBlocks :content="data?.data.content" />
  </div>
</template>
<script lang="ts" setup>
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
const { data } = await useAsyncData('cics-aso', () => $strapi('/cics-aso'))
</script>
<style lang="css">
@reference '~/assets/css/main.css';

.content-renderer {
  @apply prose dark:prose-invert max-w-4xl dark:print:prose prose-headings:my-2 prose-h1:text-2xl prose-h1:font-bold prose-h2:text-xl prose-hr:my-6 prose-hr:border-gray-200 dark:prose-hr:border-zinc-700 mx-auto ;

  @apply font-content prose-headings:font-sans;

  @apply prose-headings:prose-a:text-color! prose-headings:hover:prose-a:underline;
  @apply prose-a:no-underline prose-a:text-primary-500 prose-a:hover:text-primary-700 dark:prose-a:text-primary-400 dark:prose-a:hover:text-primary-300;
}
</style>