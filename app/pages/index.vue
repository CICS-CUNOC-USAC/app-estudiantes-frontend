<template>
  <div class="greetings">
    <HomeBanner />
    <!-- <h1 class="text-xl font-semibold">CICS App - Portal - Ingeniería CUNOC</h1>
    <section class="my-6">
      <p>
        El nuevo portal para los estudiantes de Ingenieria del Centro
        Universitario De Occidente fue creada con el fin de apoyar a los
        estudiantes a encontrar informacion que les puede ser util a lo largo de
        su carrera.
      </p>
      <br />
      <p>Está compuesta por secciones con informacion y herramientas.</p>
    </section> -->

    <div class="max-w-screen-xl px-5 pt-6 lg:px-8 mx-auto">
      <section class="portal-section">
        <h2 class="">
          <span>
            <Icon
              name="icon-park-twotone:newspaper-folding"
              class="mr-1.5 mb-1 inline"
              size="26"
            />
            Publicaciones oficiales recientes
          </span>
          <CButton
            variant="link"
            icon="lucide:square-arrow-up-right"
            to="/portal/general/publicaciones"
            label="Ver más"
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
          <span>
            <Icon :name="section.icon" class="mr-1.5 mb-1 inline" size="26" />
            {{ section.title }}
          </span>
        </h2>
        <div class="my-4 border-t border-zinc-300/50 dark:border-zinc-300/30" />

        <div
          :class="[
            section.containerClass ||
              'grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'
          ]"
        >
          <CCardAlt
            v-for="(item, index) in section.items"
            no-spacing
            class="group hover:bg-primary-100/75 active:bg-primary-200/70 dark:hover:bg-primary-900/30 dark:active:bg-primary-800/70"
            :key="index"
            :to="item.route"
          >
            <template #content>
              <img
                :src="item.img"
                class="h-28 w-full object-cover select-none"
              />
              <div class="p-5">
                <p
                  class="text-muted-color-emphasis text-xs tracking-wide italic"
                >
                  {{ item.subtitle }}
                </p>
                <h3 class="py-2 text-lg font-semibold">{{ item.title }}</h3>
                <p class="text-sm">{{ item.description }}</p>
              </div>
            </template>
          </CCardAlt>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import InfoCard from '@/components/cards/InfoCard.vue'
import HomeBanner from '~/components/portal/HomeBanner.vue'
import OfficialPostsView from '~/components/portal/OfficialPostsView.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import { sections } from '~/utils/consts/main-page.consts'

useHead({
  title: 'Inicio'
})
definePageMeta({
  extendScreen: true,
  menuClass: 'bg-cics-white dark:bg-cics-blue',
})
</script>
<style scoped>
@reference '~/assets/css/main.css';
.portal-section {
  @apply my-6;
  h2 {
    @apply flex justify-between gap-x-4 text-lg font-semibold lg:justify-start;

    svg {
      @apply text-gray-500 dark:text-gray-200;
    }

    a {
      @apply shrink-0;
    }
    /* :deep(a){
    } */
  }
}
</style>
