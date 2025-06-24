<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:bookshelf"
          class="mb-1 mr-1.5 inline-block"
        />
        Prestamos Externos
      </h1>
    </header>
    <p class="font-weight-light mt-2">
      En esta sección se podrán administrar todos los prestamos externos
      pendientes en la biblioteca de Ingenieria.
    </p>
    <LoansView />
  </main>
</template>
<script setup lang="ts">
import LoansView from '@/components/admin/library/LoansView.vue'
definePageMeta({
  layout: 'admin'
})
</script>
