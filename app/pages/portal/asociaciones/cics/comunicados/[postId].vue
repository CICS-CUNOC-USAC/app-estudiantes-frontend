<template>
  <main class="pb-8 pt-16">

    <div v-if="data?.data.hero_image" class="transition-[padding] duration-300" :class="{
      'px-6': hasScrolled,
      'p-0': !hasScrolled
    }">
      <img :src="imageUrl" :alt="data.data.hero_image.alternativeText || ''"
        class="mx-auto mb-4 max-h-125 w-full object-cover"
        :class="{
          'rounded-lg': hasScrolled,
          'rounded-none': !hasScrolled
        }"
        />
    </div>
    <section class="max-w-5xl mx-auto px-5 lg:px-8">

      <main v-if="data && status === 'success'">
        <nav class="flex flex-wrap gap-x-3 print:hidden" v-if="data && status === 'success'">
          <Button icon="icon-park-outline:arrow-left" variant="link" label="Regresar a comunicados"
            class="text-muted-foreground mb-4 lg:mb-2" to="/portal/asociaciones/cics/comunicados" />
          <Button icon="icon-park-twotone:share-one" variant="link" label="Compartir comunicado"
            class="text-muted-foreground mb-4 lg:mb-2" @click="handleShareCurrentLink" />
        </nav>
        <ComunicadoPostReactions :post-id="String(data.data.id)" />
        <h1 class="py-3 text-2xl lg:text-3xl font-semibold">
          <Icon name="lucide:megaphone" class="mr-1.5 mb-1 inline-block" />
          {{ data.data.title }}
        </h1>
        <p class="text-muted-foreground mb-4 text-sm" v-html="formatPublishedDate(data.data.publishedAt)" />

        <div class="content-renderer max-w-full! mx-auto">
          <StrapiBlocks :content="data.data.content" v-if="data.data.content" />
        </div>

        <ComunicadoPostComments :post-id="String(data.data.id)" />
      </main>
      <CMessage v-else-if="status === 'error' && !data" title="Comunicado no encontrado"
        subtitle="Parece que el comunicado que buscas no existe o no está disponible."
        back-to-label="Regresar a comunicados" back-to-route="/portal/asociaciones/cics/comunicados"
        variant="destructive" />
    </section>


  </main>
</template>
<script setup lang="ts">
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
import CMessage from '~/components/partials/CMessage.vue'
import ComunicadoPostComments from '~/components/portal/comunicados/ComunicadoPostComments.vue'
import ComunicadoPostReactions from '~/components/portal/comunicados/ComunicadoPostReactions.vue'
import Button from '~/components/ui/button/Button.vue'
import { type Comunicado } from '~/lib/api/strapi/types'
import { handleShareCurrentLink } from '~/utils/consts/share-link'

const route = useRoute()
const postId = route.params.postId as string

const { data, status } = await useAsyncData<{ data: Comunicado }>(
  `cics-comunicados-${postId}`,
  () => $strapi(`/comunicados/${postId}?populate[hero_image]=true`)
)

const imageUrl = computed(() => {
  if (data.value?.data?.hero_image) {
    return `${import.meta.env.VITE_STRAPI_URL}${data.value.data.hero_image.url}`
  }
  return
})

const { hasScrolled } = useNavScrollShadow(50)

const formatPublishedDate = (dateString: string) => {
  const date = new Date(dateString)

  const dateFormatter = new Intl.DateTimeFormat('es-GT', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Guatemala',
  })
  const timeFormatter = new Intl.DateTimeFormat('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Guatemala',
  })

  const parts = dateFormatter.formatToParts(date)
  const month = parts.find(part => part.type === 'month')?.value ?? ''
  const day = parts.find(part => part.type === 'day')?.value ?? ''
  const year = parts.find(part => part.type === 'year')?.value ?? ''
  const time = timeFormatter.format(date)

  return `${month} ${day}, ${year} · ${time}`
}

useCustomPageTitle(
  data.value?.data?.title
    ? `Comunicado - ${data.value?.data?.title}`
    : 'Comunicado'
)

useSeoMeta({
  twitterCard: 'summary_large_image',
  ogDescription: data.value?.data?.description ?? 'Comunicado CICS',
})

defineOgImage('Card.takumi', {
  title: data.value?.data?.title ?? 'Comunicado',
  subtitle: data.value?.data?.publishedAt
    ? `Publicado el ${new Date(data.value.data.publishedAt).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' })}`
    : (data.value?.data?.description ?? ''),
  badge: 'Comunicado',
  imageUrl: imageUrl.value,
})

definePageMeta({
  title: 'Comunicado',
  extendScreen: true,
})
</script>
<style scoped></style>
