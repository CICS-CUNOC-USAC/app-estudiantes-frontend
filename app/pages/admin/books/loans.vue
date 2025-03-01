<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="lucide:hand-helping"
          class="mb-1 mr-1.5 inline-block"
        />
        Prestamos
      </h1>
    </header>
    <p class="font-weight-light mt-2">
      En esta sección se podrán administrar los prestamos realizados.
    </p>
    <LoansView/>
  </main>
</template>
<script setup lang="ts">
import LoansView from '~/components/admin/library/LoansView.vue';

definePageMeta({
  layout: 'admin'
})
</script>
<style lang=""></style>
