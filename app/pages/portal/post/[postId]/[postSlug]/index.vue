<template>
  <main>
    <template v-if="data">
      <CButton
        icon="mdi-arrow-left"
        variant="link"
        label="Regresar a publicaciones"
        class="mb-4 text-muted-color lg:mb-2"
        to="/portal/general/publicaciones"
      />
      <header class="mx-auto mt-6 max-w-3xl">
        <small class="block py-1.5 text-sm text-muted-color-emphasis">{{
          data?.meta
        }}</small>
        <h1 class="flex items-center gap-x-2 text-2xl font-semibold text-color">
          {{ data?.title }}
        </h1>
        <PDivider class="!mt-3" />
      </header>
      <div class="official-post-content" v-html="data?.content" />
    </template>
    <template v-else-if="pending">
      <v-skeleton-loader
        type="article, subtitle,text, text, text, text, text, text, text, text, text, text"
      />
    </template>

    <template v-else>
      <PMessage
        severity="warn"
        pt:root:class="!outline-none !shadow-none border border-surface-950/75"
        pt:text:class="flex flex-col  items-start gap-y-1"
      >
        <template #icon>
          <Icon name="lucide:circle-help" />
        </template>
        Parece que la publicación que buscas no existe, por favor verifica el
        enlace.
        <CButton
          label="Regresar a publicaciones"
          variant="link"
          icon="lucide:arrow-left"
          to="/portal/general/publicaciones"
        />
      </PMessage>
    </template>
  </main>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'

const route = useRoute()
const postId = route.params.postId
const postSlug = route.params.postSlug

const { data, pending } = useFetch(
  `/api/official-post-detail/${postId}/${postSlug}`,
  { lazy: true }
)

useHead({
  title: () => `${data?.value?.title} - Publicación` || 'Publicación oficial'
})
</script>
<style lang="postcss">
.official-post-content {
  @apply prose prose-base prose-neutral mx-auto max-w-3xl dark:prose-invert;

  @apply prose-a:rounded-xl prose-a:bg-primary-100 prose-a:decoration-clone prose-a:px-2 prose-a:py-0.5 prose-a:font-semibold prose-a:text-primary-600 prose-a:no-underline prose-a:transition hover:prose-a:text-primary-700 hover:prose-a:underline dark:prose-a:bg-primary-900 dark:prose-a:text-primary-300;

  @apply hover:prose-a:text-primary-700 hover:prose-a:underline dark:hover:prose-a:text-primary-100;

  img {
    @apply w-full rounded-lg shadow-lg;
  }

  a:has(img) {
    @apply block !bg-transparent py-0;
  }

  .alert {
    &-danger {
      @apply rounded-xl border border-black/60 px-5 py-2 dark:border-black;
      @apply bg-pink-100/70 text-rose-800 dark:bg-rose-800/65 dark:text-rose-300;
    }

    &-success {
      @apply rounded-xl border border-black/60 px-5 py-2 dark:border-black;
      @apply bg-emerald-100/70 text-emerald-800 dark:bg-emerald-800/65 dark:text-emerald-300;
    }

    &-warning {
      @apply rounded-xl border border-black/60 px-5 py-2 dark:border-black;
      @apply bg-amber-100/70 text-amber-800 dark:bg-amber-800/65 dark:text-amber-300;
    }
  }

  iframe {
    @apply min-h-96 min-w-full rounded-lg shadow-md;
  }
}
</style>
