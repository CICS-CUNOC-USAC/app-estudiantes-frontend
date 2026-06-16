<template>
  <main class="pb-8">
    <nav
      class="flex flex-wrap gap-x-3 print:hidden"
      v-if="data && status === 'success'"
    >
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a comunicados"
        class="text-muted-foreground mb-4 lg:mb-2"
        to="/portal/asociaciones/cics/comunicados"
      />
      <Button
        icon="icon-park-twotone:share-one"
        variant="link"
        label="Compartir comunicado"
        class="text-muted-foreground mb-4 lg:mb-2"
        @click="handleShareCurrentLink"
      />
    </nav>
    <main v-if="data && status === 'success'">
      <ComunicadoPostReactions :post-id="String(data.data.id)" />
      <h1 class="py-3 text-xl font-semibold">
        <Icon name="lucide:megaphone" class="mr-1.5 mb-1 inline-block" />
        {{ data.data.title }}
      </h1>
      <p
        class="text-muted-foreground mb-4 text-sm"
        v-html="formatPublishedDate(data.data.publishedAt)"
      />

      <div class="content-renderer mx-auto">
        <StrapiBlocks :content="data.data.content" v-if="data.data.content" />
      </div>

      <ComunicadoPostComments :post-id="String(data.data.id)" />
    </main>
    <CMessage
      v-else-if="status === 'error' && !data"
      title="Comunicado no encontrado"
      subtitle="Parece que el comunicado que buscas no existe o no está disponible."
      back-to-label="Regresar a comunicados"
      back-to-route="/portal/asociaciones/cics/comunicados"
      variant="destructive"
    />
  </main>
</template>
<script setup lang="ts">
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import Button from '~/components/ui/button/Button.vue'
import ComunicadoPostComments from '~/components/portal/comunicados/ComunicadoPostComments.vue'
import ComunicadoPostReactions from '~/components/portal/comunicados/ComunicadoPostReactions.vue'
import { type Comunicado } from '~/lib/api/strapi/types'
import CMessage from '~/components/partials/CMessage.vue'
import { handleShareCurrentLink } from '~/utils/consts/share-link'

const route = useRoute()
const postId = route.params.postId as string

const { data, status } = await useAsyncData<{ data: Comunicado }>(
  `cics-comunicados-${postId}`,
  () => $strapi(`/comunicados/${postId}`)
)

const formatPublishedDate = (dateString: string) => {
  const date = new Date(dateString)

  // Convert to GMT-6 by subtracting 6 hours in milliseconds
  const gmt6Date = new Date(date.getTime() - 6 * 60 * 60 * 1000)

  const year = gmt6Date.getUTCFullYear()
  const month = String(gmt6Date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(gmt6Date.getUTCDate()).padStart(2, '0')
  const hours = String(gmt6Date.getUTCHours()).padStart(2, '0')
  const minutes = String(gmt6Date.getUTCMinutes()).padStart(2, '0')

  return `
  Publicado el 
  <strong>${day}-${month}-${year}</strong>
  a las 
  <strong>${hours}:${minutes}</strong>
  `
}

useCustomPageTitle(
  data.value?.data?.title
    ? `Comunicado - ${data.value?.data?.title}`
    : 'Comunicado'
)

const { origin } = useRequestURL()
const basePath = '/estudiantes'
useSeoMeta({
  ogImage: `${origin}${basePath}/api/og/comunicado/${postId}`,
  twitterImage: `${origin}${basePath}/api/og/comunicado/${postId}`,
  twitterCard: 'summary_large_image',
  ogDescription: data.value?.data?.description ?? 'Comunicado CICS',
})

definePageMeta({
  title: 'Comunicado'
})
</script>
<style scoped></style>
