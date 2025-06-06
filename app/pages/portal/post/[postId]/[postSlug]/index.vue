<template>
  <main>
    <nav class="flex flex-wrap gap-x-3">
      <CButton
        v-if="fromSearch"
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a búsqueda"
        class="text-muted-color mb-4 lg:mb-2"
        :to="`/portal/general/busqueda?q=${fromSearch}`"
      />
      <CButton
        icon="lucide:layout-dashboard"
        variant="link"
        label="Ver todas las publicaciones"
        class="text-muted-color mb-4 lg:mb-2"
        to="/portal/general/publicaciones"
      />
    </nav>
    <header class="mx-auto mt-2 max-w-3xl">
      <template v-if="status === 'pending'">
        <PSkeleton class="mt-1.5 mb-5"></PSkeleton>
        <PSkeleton height="2.3rem" class=""></PSkeleton>
      </template>
      <template v-else-if="status === 'success' && data">
        <small class="text-muted-color-emphasis block pb-5 text-sm">{{
          data?.meta
        }}</small>
        <h1
          class="text-color flex flex-col items-start gap-3 text-2xl font-bold"
        >
          {{ data?.title }}

          <AttachmentsPopover :attachments="data?.attachments" />
        </h1>
      </template>

      <!-- <div class="mt-4 border-t border-zinc-300/50 dark:border-zinc-300/30" /> -->
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

    <template v-else-if="status === 'error' && error?.statusCode === 404">
      <ElementNotFound
        title="Publicación no encontrada"
        subtitle="Parece que la publicación que buscas no existe, por favor verifica el enlace."
        backToLabel="Regresar a publicaciones"
        backToRoute="/portal/general/publicaciones"
      />
    </template>
    <template v-else-if="status === 'error' && error?.statusCode === 500">
      <ElementNotFound
        title="Publicación no disponible"
        subtitle="Parece que este contenido no está disponible en este momento, por favor intenta más tarde o verifica el enlace."
        backToLabel="Regresar a publicaciones"
        backToRoute="/portal/general/publicaciones"
      />
    </template>
  </main>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
import AttachmentsPopover from './(components)/AttachmentsPopover.vue'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import CMessage from '~/components/partials/CMessage.vue'

const route = useRoute()
const postId = route.params.postId
const postSlug = route.params.postSlug
const fromSearch = route.query.fromSearch

const { data, status, error } = await useFetch(
  `/api/official-post-detail/${postId}/${postSlug}`
)

useCustomPageTitle(
  data.value?.title
    ? `${data.value.title} | Publicación`
    : 'Publicación oficial'
)
definePageMeta({
  title: 'Publicación oficial'
})
</script>
<style>
@reference '~/assets/css/main.css';

.official-post-content {
  @apply prose prose-base prose-neutral dark:prose-invert max-w-none;
  
  @apply font-content;

  /* @apply prose-a:border-b prose-a:border-primary-500 prose-a:font-medium prose-a:no-underline prose-a:transition prose-a:hover:border-b-2; */

  @apply prose-a:no-underline prose-a:text-primary-500 prose-a:hover:text-primary-700 dark:prose-a:text-primary-400 dark:prose-a:hover:text-primary-300;

  @apply prose-a:after:content-['_↗'];

  img {
    @apply w-full rounded-lg shadow-lg border dark:border-white/40 border-slate-900/10;
  }

  a:has(img) {
    @apply block !bg-transparent py-0;
  }

  .alert {
    @apply rounded-xl border px-4 py-1;
    @apply bg-surface-100/40 dark:bg-surface-900/65;
  }

  .alert-danger {
    @apply dark:border-zinc-700;
    & * {
      @apply text-rose-800 dark:text-red-200;
    }
    @apply text-rose-800 dark:text-red-200;
  }

  .alert-success {
    @apply dark:border-zinc-700;
    & * {
      @apply text-emerald-800 dark:text-emerald-200;
    }

    @apply text-emerald-800 dark:text-emerald-200;
  }

  .alert-warning {
    @apply dark:border-zinc-700;
    & * {
      @apply text-amber-800 dark:text-amber-200;
    }
    @apply text-amber-800 dark:text-amber-200;
  }

  iframe {
    @apply min-h-96 min-w-full rounded-lg shadow-md;
  }
}
</style>
