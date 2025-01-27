<template>
  <CCardAlt class="max-w-md mx-auto">
    <template #title>
        <header
          class="flex items-center flex-col justify-center gap-y-4 pb-6 "
        >
          <Icon name="icon-park-twotone:tool" class="text-primary-400" size="32" />
          <span class="block text-muted-color">{{ section }}</span>
          <h1 class="text-xl font-bold">
            En construcción...
          </h1>
        </header>
      </template>
      <template #content>
        <div class="text-center">
          <p class="mb-4">
            Esta sección está en construcción. Por favor, regresa más tarde.
          </p>
          <NuxtLink
          to="/"
          class=" inline text-primary-400 transition border-b hover:border-b-2 border-primary-400 hover:border-primary-500 hover:text-primary-500"
          >
          <Icon class="mb-1 mr-1 inline" name="icon-park-outline:arrow-left" />
          <strong>Regresar al inicio</strong>
        </NuxtLink>
      </div>
      </template>
  </CCardAlt>
</template>

<script lang="ts" setup>
import CCardAlt from '~/components/primitives/card/CCardAlt.vue';
defineProps({
  section: {
    type: String,
    required: true
  }
})
</script>

