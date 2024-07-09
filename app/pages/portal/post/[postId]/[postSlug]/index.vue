<template>
  <main>
    <template v-if="data">
      <h1
        class="d-flex flex-column flex-md-row align-md-center align-start ga-4"
      >
        <v-btn
          icon="mdi-arrow-left"
          density="comfortable"
          color="accent-2"
          :to="'/portal/general/publicaciones'"
        />
        {{ data?.title }}
      </h1>
      <p class="text-overline">{{ data?.meta }}</p>
      <div class="official-post-content" v-html="data?.content" />
    </template>
    <template v-else-if="pending">
      <v-skeleton-loader
        type="article, subtitle,text, text, text, text, text, text, text, text, text, text"
      />
    </template>

    <template v-else>
      <v-btn
        prepend-icon="mdi-arrow-left"
        color="accent-3"
        :to="'/'"
        class="mb-4"
        >Regresar al incio</v-btn
      >
      <v-alert
        color="accent-3"
        icon="mdi-alert-circle"
        class="d-flex align-center"
        variant="text"
        >No se ha encontrado la publicación que buscas, por favor verifica la
        URL
      </v-alert>
    </template>
  </main>
</template>
<script setup lang="ts">
const route = useRoute()
const postId = route.params.postId
const postSlug = route.params.postSlug

const { data, pending } = useFetch(
  `/api/official-post-detail/${postId}/${postSlug}`,
  { lazy: true }
)
</script>
<style lang="scss">
.official-post-content {
  padding: 1rem;

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
  }
}
</style>
