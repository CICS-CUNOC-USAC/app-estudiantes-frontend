<template>
  <div class="mx-6 lg:mx-auto flex h-screen max-w-2xl flex-col justify-center">
    <CCardAlt class="py-8" unstyled>
      <template #title>
        <header
          class="flex items-center flex-col justify-center gap-y-4 pb-6 text-xl font-bold"
        >
          <Icon :name="icon" class="text-primary-400" size="32" />
          <h1>
            <span class="font-mono">{{ error.statusCode }}</span> -
            {{ title }}
          </h1>
        </header>
      </template>
      <template #content>
        <div class="text-center">

          <p class="mb-4">
            {{ message }}
          </p>
          puedes
          <NuxtLink
          href="/"
          class=" inline text-primary-400 transition border-b hover:border-b-2 border-primary-400 hover:border-primary-500 hover:text-primary-500 font-semibold "
          >
          <Icon class="mb-0.5 inline" name="icon-park-outline:arrow-left" />
          regresar al inicio
        </NuxtLink>
      </div>
      </template>
    </CCardAlt>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import CCardAlt from './components/primitives/card/CCardAlt.vue'

const { error } = defineProps<{
  error: NuxtError
}>()


const title = computed(() =>
  error.statusCode === 404 ? 'Página no encontrada' : 'Ha ocurrido un error'
)
const icon = computed(() =>
  error.statusCode === 404
    ? 'icon-park-twotone:help'
    : 'icon-park-twotone:attention'
)
const message = computed(() =>
  error.statusCode === 404
    ? 'Parece que la página que buscas no existe o ha sido movida.'
    : 'Lo sentimos, se ha producido un error inesperado.'
)
</script>