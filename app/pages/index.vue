<template>
  <div class="greetings">
    <h1 class="text-xl font-semibold">CICS App - Portal - Ingeniería CUNOC</h1>
    <section class="my-6">
      <p>
        El nuevo portal para los estudiantes de Ingenieria del Centro
        Universitario De Occidente fue creada con el fin de apoyar a los
        estudiantes a encontrar informacion que les puede ser util a lo largo de
        su carrera.
      </p>
      <br />
      <p>Está compuesta por secciones con informacion y herramientas.</p>
    </section>
    <section class="portal-section">
      <h2 class="">
        Publicaciones oficiales recientes
        <CButton
          variant="text"
          icon="lucide:square-arrow-out-up-right"
          to="/portal/general/publicaciones"
          v-Ptooltip.top="'Ver todas las publicaciones'"
        />
      </h2>
      <div class="mt-4 border-t border-zinc-300/50 dark:border-zinc-300/30" />
      <OfficialPostsView />
    </section>
    <section
      v-for="section in sections"
      :key="section.name"
      class="portal-section"
    >
      <h2>
        {{ section.title }}
      </h2>
      <div class="my-4 border-t border-zinc-300/50 dark:border-zinc-300/30" />

      <div
        class="grid w-full grid-flow-col gap-4"
        :class="{
          'grid-cols-1 place-content-center px-44': section.name === 'extra'
        }"
      >
        <CCardAlt
          v-for="(item, index) in section.items"
          no-spacing
          class="group hover:bg-primary-100/75 active:bg-primary-200/70 dark:hover:bg-primary-900/30 dark:active:bg-primary-800/70"
          :key="index"
          :to="item.route"
        >
          <template #content>
            <img :src="item.img" class="h-28 w-full select-none object-cover" />
            <div class="p-5">
              <p
                class="text-xs italic tracking-wide text-muted-color-emphasis"
              >
                {{ item.subtitle }}
              </p>
              <h3 class="text-lg font-semibold py-2">{{ item.title }}</h3>
              <p class="text-sm">{{ item.description }}</p>
            </div>
          </template>
        </CCardAlt>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import InfoCard from '@/components/cards/InfoCard.vue'
import OfficialPostsView from '~/components/portal/OfficialPostsView.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import { sections } from '~/utils/consts/main-page.consts'

useHead({
  title: 'Inicio'
})
</script>
<style scoped lang="postcss">
.portal-section {
  @apply my-6;  
  h2 {
    @apply flex items-center gap-x-2 text-lg font-semibold;
  }
}
</style>
