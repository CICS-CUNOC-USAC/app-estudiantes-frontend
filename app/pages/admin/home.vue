<template>
  <main>
    <h1>Administración</h1>
    <h2 class="font-weight-light">Contenido</h2>
    <v-row>
      <v-col v-for="item in items" :key="item.title">
        <v-card class="mx-auto" max-width="344" outlined tile>
          <v-list-item link :to="item.to">
            <v-icon>{{ item.icon }}</v-icon>
            <v-list-item-title class="text-h5">{{
              item.title
            }}</v-list-item-title>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </main>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
const items = ref([
  {
    title: 'Artículos',
    icon: 'mdi-newspaper',
    to: '/admin/articles'
  },
  {
    title: 'Manuales',
    icon: 'mdi-book-open-page-variant',
    to: '/admin/manuals'
  },
  {
    title: 'Biblioteca',
    icon: 'mdi-bookshelf',
    to: '/admin/library'
  },
  {
    title: 'Tesario',
    icon: 'mdi-book-open-page-variant',
    to: '/admin/thesis'
  }
])
</script>
<style lang=""></style>
