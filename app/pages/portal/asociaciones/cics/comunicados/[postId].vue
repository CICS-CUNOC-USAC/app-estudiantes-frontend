<template>
  <main class="">
    <nav
      class="flex flex-wrap gap-x-3 print:hidden"
      v-if="data && status === 'success'"
    >
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a comunicados"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/portal/asociaciones/cics/comunicados"
      />
    </nav>
    <!-- <ContentDisplay :data v-if="data && status === 'success'" /> -->
    <!-- Reactions -->

    <div v-if="data && reactionsData" class="mb-4">
      <p class="text-muted-foreground mb-2 text-sm">Reacciones:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="reaction in Object.keys(reactionsData.counts)"
          :key="reaction"
          class="flex w-12 items-center rounded-full border-2 border-black px-2 py-1 transition hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
          :class="{
            'border-primary-500/50 shadow-primary-500/50':
              reactionsData.userReaction?.includes(reaction),
            '': !reactionsData.userReaction?.includes(reaction)
          }"
          @click="toggleReaction(reaction)"
        >
          <!-- <span class="text-sm">{{
            MAPPED_REACTIONS_EMOJIS[reaction] || '❓'
          }}</span> -->
          <Icon
            :name="
              MAPPED_REACTIONS_ICON_COMPONENTS[reaction] ||
              'lucide:question-mark'
            "
          />
          <span class="text-muted-foreground ml-1 text-xs">{{
            reactionsData.counts[reaction]
          }}</span>
        </button>
      </div>
    </div>
    <main v-if="data && status === 'success'">
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
    </main>
    <ElementNotFound
      v-else-if="status === 'error' && !data"
      title="Comunicado no encontrado"
      subtitle="Parece que el comunicado que buscas no existe o no está disponible."
      back-to-label="Regresar a comunicados"
      back-to-route="/portal/asociaciones/cics/comunicados"
    />
  </main>
</template>
<script setup lang="ts">
import { toast } from 'vue-sonner'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import {
  MAPPED_REACTIONS_EMOJIS,
  MAPPED_REACTIONS_ICON_COMPONENTS,
  type Comunicado,
  type StrapiPostReactionResponse
} from '~/lib/api/strapi/types'

const route = useRoute()
const postId = route.params.postId as string

const { data, status } = await useAsyncData<{ data: Comunicado }>(
  `cics-comunicados-${postId}`,
  () => $strapi(`/comunicados/${postId}`)
)

// Reactions
const { data: reactionsData, refresh: refreshReactions } =
  await useAsyncData<StrapiPostReactionResponse>(
    `cics-comunicados-${postId}-reactions`,
    () => $api(`/reactions/${data.value?.data.id}`),
    { lazy: true }
  )

const toggleReaction = async (reaction: string) => {
  if (!authenticated.value) {
    toast.error('Debes iniciar sesión para reaccionar a la publicación.')
    return
  }
  try {
    await $api(`/reactions/toggle`, {
      method: 'POST',
      body: {
        strapiPostId: String(data.value?.data.id),
        type: reaction
      }
    })
    refreshReactions()
  } catch (error) {
    toast.error('Error al reaccionar a la publicación.')
  }
}

const { authenticated } = storeToRefs(useRegularAuthStore())

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
definePageMeta({
  title: 'Comunicado'
})
</script>
<style scoped></style>
