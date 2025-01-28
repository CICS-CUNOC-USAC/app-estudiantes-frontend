<template>
  <main>
    <nav class="flex flex-wrap gap-x-3">
      <CButton
      v-if="fromSearch"
      icon="icon-park-outline:arrow-left"
      variant="link"
      label="Regresar a búsqueda"
      class="mb-4 text-muted-color lg:mb-2"
      :to="`/portal/general/busqueda?q=${fromSearch}`"
      />
      <CButton
        icon="lucide:layout-dashboard"
        variant="link"
        label="Ver todas las publicaciones"
        class="mb-4 text-muted-color lg:mb-2"
        to="/portal/general/publicaciones"
      />
    </nav>
    <header class="mx-auto mt-2 max-w-3xl">
      <template v-if="status === 'pending'">
        <PSkeleton class="mb-5 mt-1.5"></PSkeleton>
        <PSkeleton height="2.3rem" class=""></PSkeleton>
      </template>
      <template v-else-if="status === 'success' && data">
        <small class="block pb-5 text-sm text-muted-color-emphasis">{{
          data?.meta
        }}</small>
        <h1
          class="flex flex-col items-start gap-3 text-2xl font-bold text-color"
        >
          {{ data?.title }}

          <AttachmentsPopover :attachments="data?.attachments" />
        </h1>
      </template>

      <div class="mt-4 border-t border-zinc-300/50 dark:border-zinc-300/30" />
    </header>
    <template v-if="status === 'pending'">
      <div class="mx-auto mt-5 max-w-3xl">
        <PSkeleton width="100%"></PSkeleton>
        <PSkeleton width="60%" class="mt-2"></PSkeleton>
        <PSkeleton width="80%" class="mt-4"></PSkeleton>
      </div>
    </template>
    <template v-else-if="status === 'success' && data">
      <article class="mx-auto max-w-3xl">
        <div class="official-post-content" v-html="data?.content" />
      </article>
    </template>

    <template v-else-if="status === 'error'">
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
          icon="icon-park-outline:arrow-left"
          to="/portal/general/publicaciones"
        />
      </PMessage>
    </template>
  </main>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
import AttachmentsPopover from './(components)/AttachmentsPopover.vue'

const route = useRoute()
const postId = route.params.postId
const postSlug = route.params.postSlug
const fromSearch = route.query.fromSearch

const { data, status } = useFetch(
  `/api/official-post-detail/${postId}/${postSlug}`,
  { lazy: true }
)

useHead({
  title: () => data?.value?.title ? `${data.value.title} | Publicación` : 'Publicación oficial',
})
</script>
<style lang="postcss">
.official-post-content {
  @apply prose prose-base prose-neutral max-w-none dark:prose-invert;

  @apply prose-a:border-b prose-a:border-primary-500 prose-a:font-semibold prose-a:no-underline prose-a:transition hover:prose-a:border-b-2;

  @apply hover:prose-a:text-color-emphasis dark:hover:prose-a:text-primary-100;

  img {
    @apply w-full rounded-lg shadow-lg;
  }

  a:has(img) {
    @apply block !bg-transparent py-0;
  }

  .alert {
    &-danger {
      @apply dark:border-zinc-700;
      & * {
        @apply text-rose-800 dark:text-red-200;
      }
      @apply rounded-xl border bg-surface-100/40 px-4 py-2 dark:bg-surface-900/65;
      @apply text-rose-800 dark:text-red-200;
    }

    &-success {
      @apply dark:border-zinc-700;
      & * {
        @apply text-emerald-800 dark:text-emerald-200;
      }
      @apply rounded-xl border px-4 py-2;
      @apply bg-surface-100/40 dark:bg-surface-900/65;
      @apply text-emerald-800 dark:text-emerald-200;
    }

    &-warning {
      @apply dark:border-zinc-700;
      & * {
        @apply text-amber-800 dark:text-amber-200;
      }
      @apply rounded-xl border px-4 py-2;
      @apply bg-surface-100/40 dark:bg-surface-900/65;
      @apply text-amber-800 dark:text-amber-200;
    }
  }

  iframe {
    @apply min-h-96 min-w-full rounded-lg shadow-md;
  }
}
</style>
