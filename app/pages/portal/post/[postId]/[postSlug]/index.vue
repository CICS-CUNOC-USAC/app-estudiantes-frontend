<template>
  <main class="pb-8 pt-16">


    <section class="max-w-5xl mx-auto px-5 lg:px-8">
      <header class="mx-auto mt-2">
        <template v-if="status === 'pending'">
          <Skeleton class="mt-1.5 mb-5"></Skeleton>
          <Skeleton height="2.3rem" class=""></Skeleton>
        </template>
        <template v-else-if="status === 'success' && data">
          <nav class="flex flex-wrap gap-x-3">
            <Button v-if="fromSearch" icon="icon-park-outline:search" variant="link" :label="`Regresar a búsqueda: ${fromSearch}`"
              class="text-muted-color mb-4 lg:mb-2" :to="`/portal/general/busqueda?q=${fromSearch}`" />
            <Button icon="icon-park-outline:arrow-left" variant="link" label="Regresar a publicaciones"
              class="text-muted-color mb-4 lg:mb-2" to="/portal/general/publicaciones" />
            <Button icon="icon-park-twotone:share-one" variant="link" label="Compartir publicación"
              class="text-muted-color mb-4 lg:mb-2" @click="handleShareCurrentLink" />
          </nav>

          <h1 class="py-3 text-2xl lg:text-3xl font-semibold">
            <Icon name="lucide:newspaper" class="mr-1.5 mb-1 inline-block" />
            {{ data?.title }}

            <AttachmentsPopover :attachments="data?.attachments" />
          </h1>
          <small class="text-muted-foreground mb-4 text-sm">{{
            data?.meta
            }}</small>
        </template>

        <!-- <div class="mt-4 border-t border-zinc-300/50 dark:border-zinc-300/30" /> -->
      </header>
      <template v-if="status === 'pending'">
        <div class="mx-auto mt-5 max-w-full">
          <Skeleton width="100%"></Skeleton>
          <Skeleton width="60%" class="mt-2"></Skeleton>
          <Skeleton width="80%" class="mt-4"></Skeleton>
        </div>
      </template>
      <template v-else-if="status === 'success' && data">
        <article class="mx-auto max-w-full!">
          <div class="official-post-content" v-html="data?.content" />
        </article>
      </template>

      <template v-else-if="status === 'error' && error?.statusCode === 404">
        <ElementNotFound title="Publicación no encontrada"
          subtitle="Parece que la publicación que buscas no existe, por favor verifica el enlace."
          backToLabel="Regresar a publicaciones" backToRoute="/portal/general/publicaciones" />
      </template>
      <template v-else-if="status === 'error' && error?.statusCode === 500">
        <ElementNotFound title="Publicación no disponible"
          subtitle="Parece que este contenido no está disponible en este momento, por favor intenta más tarde o verifica el enlace."
          backToLabel="Regresar a publicaciones" backToRoute="/portal/general/publicaciones" />
      </template>
    </section>
  </main>
</template>
<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import AttachmentsPopover from './(components)/AttachmentsPopover.vue'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import CMessage from '~/components/partials/CMessage.vue'
import { Skeleton } from '~/components/ui/skeleton'
import { handleShareCurrentLink } from '~/utils/consts/share-link.js'

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


const { origin } = useRequestURL()
const basePath = '/estudiantes'
useSeoMeta({
  ogImage: `${origin}${basePath}/api/og/post/${postId}/${postSlug}`,
  twitterImage: `${origin}${basePath}/api/og/post/${postId}/${postSlug}`,
  twitterCard: 'summary_large_image',
  ogDescription: data.value?.meta ?? 'Publicación oficial CICS'
})

definePageMeta({
  title: 'Publicación oficial',
  extendScreen: true
})
</script>
<style>
@reference '~/assets/css/main.css';

.official-post-content {
  @apply prose prose-base lg:prose-lg dark:prose-invert max-w-full;

  @apply prose-headings:font-heading font-sans;

  /* @apply prose-a:border-b prose-a:border-primary-500 prose-a:font-medium prose-a:no-underline prose-a:transition prose-a:hover:border-b-2; */

  @apply prose-a:no-underline prose-a:text-primary-500 prose-a:hover:text-primary-700 dark:prose-a:text-primary-400 dark:prose-a:hover:text-primary-300;

  @apply prose-a:after:content-['_↗'];

  img {
    @apply w-full rounded-lg shadow-md ring-2 ring-gray-300/75;
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
    @apply min-h-96 min-w-full shadow-md;
  }
}
</style>
