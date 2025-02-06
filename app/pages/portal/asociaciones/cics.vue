<template>
  <ContentDisplay :data />
</template>

<script lang="ts" setup>
import ContentDisplay from '~/components/portal/ContentDisplay.vue';

const { data } = await useAsyncData(() =>
  queryContent('associations')
    .where({
      _path: { $contains: '/associations/cics' }
    })
    .findOne()
)

useCustomPageTitle(data.value?.title);
</script>

<style scoped lang="postcss">
.toc-item {
  @apply relative flex items-center rounded-lg py-px pl-4 pr-2 font-medium transition-all duration-200 text-muted-color hover:text-black hover:before:bg-black dark:bg-transparent dark:hover:text-white hover:before:dark:bg-white;
  &::before {
    @apply absolute -left-[2px] top-1/2 h-full w-0.5 -translate-y-1/2 rounded-full bg-transparent dark:bg-neutral-700;
    content: '';

    /* Comment if no animation is needed */
    /* @apply transition-all duration-100 ease-in-out; */
  }
}

.content-renderer {
  @apply prose mx-auto max-w-none dark:prose-invert prose-headings:my-2 prose-h1:text-2xl prose-h1:font-bold prose-h2:text-xl prose-hr:my-6 lg:w-9/12;

  @apply prose-a:border-b prose-a:border-primary-500 prose-a:font-semibold prose-a:no-underline prose-a:transition hover:prose-a:border-b-2;

  @apply hover:prose-a:text-color-emphasis dark:hover:prose-a:text-primary-100;

  @apply prose-a:prose-headings:border-b-0 prose-a:prose-headings:border-primary-500 hover:prose-a:prose-headings:border-b;
}
</style>
