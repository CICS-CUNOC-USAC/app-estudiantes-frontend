<template>
  <main>
    <nav class="space-x-4">
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/"
      />
      <Button
        icon="icon-park-outline:paragraph-alphabet"
        variant="link"
        label="Regresar a información de la asociación"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/portal/asociaciones/cics"
      />
    </nav>
    <h1 class="py-3 text-xl font-semibold">
      <Icon name="lucide:megaphone" class="mr-1.5 mb-1 inline-block" />
      Comunicados del Cómite de Ingeniería en Ciencias y Sistemas
    </h1>
    <p class="font-weight-light my-4">
      En esta sección podrás encontrar todos los comunicados relacionados con el
      Cómite de Ingeniería en Ciencias y Sistemas. Mantente informado sobre las
      últimas noticias, eventos y actualizaciones relevantes para los
      estudiantes de esta carrera.
    </p>
    <CInfiniteScroll
      @load-more="load"
      v-if="data"
      :loading="status === 'pending'"
      :immediate="false"
    >
      <div v-if="data" class="grid grid-cols-1 gap-4 lg:grid-cols-3 pb-6">
        <CCardAlt
          v-for="post in data.data"
          :to="`/portal/asociaciones/cics/comunicados/${post.documentId}`"
          :title="post.title"
          header-icon="lucide:text"
          :description="post.description"
          class="hover:bg-primary-100 dark:hover:bg-primary-900/50"
          interactive-inverse
          :key="post.documentId"
        >
        </CCardAlt>
      </div>
      <p
        v-if="message"
        class="text-center text-sm text-muted-color-emphasis mt-4"
      >
        {{ message }}
      </p>
    </CInfiniteScroll>
  </main>
</template>
<script setup lang="ts">
import type { Strapi5ResponseMany } from '@nuxtjs/strapi'
import { toast } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CInfiniteScroll from '~/components/primitives/data/CInfiniteScroll.vue'
import type { Comunicado } from '~/lib/api/strapi/types'

const { data, status } = await useAsyncData<Strapi5ResponseMany<Comunicado>>(
  'cics-comunicados',
  () => $strapi('/comunicados', {
    query: {
      sort: ['publishedAt:desc'],
      pagination: {
        pageSize: 10
      }
    }
  })
)

const page = ref(1)
const message = ref('')

async function load() {
  if (status.value === 'pending') return
  status.value = 'pending'
  try {
    const res = await $strapi<Strapi5ResponseMany<Comunicado>>('/comunicados', {
      query: {
        sort: ['publishedAt:desc'],
        "pagination[page]": page.value + 1,
        "pagination[pageSize]": 10
      }
    })
    if (res.data && res.data.length > 0 && data.value) {
      data.value.data.push(...res.data)
      page.value += 1
    } else if (res.data && res.data.length === 0) {
      // No more data to load
      // toast.warning('No hay más comunicados para mostrar.')
      message.value = 'No hay más comunicados para mostrar.'
      setTimeout(() => {
        message.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('Error loading more comunicados:', error)
    status.value = 'error'
  } finally {
    status.value = 'success'
  }
}
</script>
<style scoped></style>
