<template>
  <div class="max-w-4xl mx-auto h-screen flex flex-col justify-center">
    <CCardAlt class="h-min py-8" elevated>
      <template #title>
        <header class="flex items-center pb-6 text-xl font-bold gap-x-2 justify-center">
          <Icon name="lucide:badge-alert" />
          <h1>Ha ocurrido un error</h1>
        </header>
      </template>
      <template #content>
        <p class="text-center">
          Puede que esta página no exista o se haya producido un error interno,
          puedes
          <NuxtLink href="/" class="text-primary-400 border-b border-primary-400 hover:border-primary-500 hover:text-primary-500 hover:border-b-2 transition">
            <strong>regresar al inicio</strong>
            <Icon class="inline mb-1 ml-1" name="lucide:home" />
          </NuxtLink>
        </p>
      </template>
    </CCardAlt>
  </div>
</template>

<script setup lang="ts">
import CCardAlt from './components/primitives/card/CCardAlt.vue';

definePageMeta({
  layout: 'empty',
})
</script>

<style scoped lang="scss">
.container {
  height: 90vh;
  display: flex;
  align-items: center;
}
</style>
