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
      <h1
        class="flex items-center gap-x-2 text-2xl font-semibold text-color lg:font-medium"
      >
        {{ data?.title }}
      </h1>
      <p class="py-1.5 text-sm text-muted-color-emphasis">{{ data?.meta }}</p>
      <PDivider class="!mt-1" />
      <div
        class="official-post-content"
        v-html="data?.content"
      />
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
  title: data?.value?.title
})
</script>
<style lang="postcss">
.official-post-content {
  @apply prose prose-base prose-neutral mx-auto dark:prose-invert lg:leading-6;

  @apply 
    prose-a:bg-primary-100 prose-a:py-1 prose-a:px-2 prose-a:decoration-clone prose-a:text-primary-600 prose-a:font-semibold hover:prose-a:text-primary-700 prose-a:no-underline hover:prose-a:underline prose-a:transition
    prose-a:rounded-xl
    dark:prose-a:bg-primary-900 dark:prose-a:text-primary-300
    ;
    
  @apply
    hover:prose-a:text-primary-700 hover:prose-a:underline dark:hover:prose-a:text-primary-100;

  img {
    @apply w-full rounded-lg shadow-lg;
  }

  a:has(img) {
    @apply !bg-transparent block py-0;
  }

  .alert {
    @apply border border-black/60 dark:border-black rounded-xl px-5 py-1.5;
    
    &-danger {
      @apply bg-pink-100/70 text-rose-800 dark:bg-rose-800/65 dark:text-rose-300;
    }

    &-success {
      @apply bg-emerald-100/70 text-emerald-800 dark:bg-emerald-800/65 dark:text-emerald-300;
    }

    &-warning {
      @apply bg-amber-100/70 text-amber-800 dark:bg-amber-800/65 dark:text-amber-300;
    } 
  }

  /*padding: 1rem;

  @media (min-width: 768px) {
    padding: 1rem;
  }

  line-height: 1.7;

  p > img,
  .imgart > a > img {
    max-width: 100%;
    height: auto;
    border-radius: 1rem;
    margin-block: 0.8rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }

  p > iframe {
    width: 100%;
    height: 80vh;
    border-radius: 0.5rem;
    border: 2px solid gray;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  p > a,
  strong > a {
    color: rgb(var(--v-theme-accent-3));
    text-decoration: none;
    transition: all 0.3s;
    font-weight: bold;
    border-bottom: 2px solid transparent;
    &:hover {
      // border-color: #0056b3;
      border-color: rgb(var(--v-theme-accent-2));
      color: rgb(var(--v-theme-accent-2));
      text-shadow: 0 0 5px rgba(var(--v-theme-accent-2), 0.4);
    }
  }

  ul {
    padding-inline-start: 2rem;
  }

  .alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    border-radius: 1rem;
    margin-block: 0.5rem;
  }

  .alert-success {
    margin-block: 0.5rem;
    background-color: #d4edda;
    color: #155724;
    border-color: #c3e6cb;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    border-radius: 1rem;
  }*/
}
</style>
