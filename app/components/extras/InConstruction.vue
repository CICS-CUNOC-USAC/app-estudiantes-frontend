<template>
  <CCardAlt class="mx-auto max-w-md">
    <template #content>
      <header class="flex flex-col items-center justify-center gap-y-4 pb-6">
        <Icon
          name="icon-park-twotone:tool"
          class="text-primary-400"
          size="32"
        />
        <span class="text-muted-color block">{{ section }}</span>
        <h1 class="text-xl font-bold">En construcción...</h1>
      </header>
      <div class="text-center">
        <p class="mb-4">
          Aun estamos trabajando en esta sección. Por favor, regresa más tarde.
        </p>
        <Button
          variant="link"
          to="/"
          label="Regresar al inicio"
          icon="icon-park-outline:arrow-left"
        />
      </div>
    </template>
  </CCardAlt>
</template>

<script lang="ts" setup>
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import Button from '~/components/ui/button/Button.vue'
defineProps({
  section: {
    type: String,
    required: true
  }
})
</script>
