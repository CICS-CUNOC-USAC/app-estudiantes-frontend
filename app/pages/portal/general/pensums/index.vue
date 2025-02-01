<template>
  <main class="relative">
    <nav class="space-x-4">
      <CButton
        icon="lucide:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="mb-4 text-muted-color-emphasis lg:mb-2"
        to="/"
      />
    </nav>
    <h1 class="py-3 text-xl font-semibold">
      <Icon name="lucide:presentation" class="mb-1 mr-1.5 inline-block" />
      Pensas de estudios
    </h1>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InfoCard
        v-for="(career, index) in careers"
        :img="career.img"
        :title="career.name"
        :route="career.route"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import HelpDialog from '@/components/dialogs/help/HelpDialog.vue'
import InfoCard from '@/components/cards/InfoCard.vue'
import CButton from '~/components/primitives/button/CButton.vue'

import { careers, contentHelp } from './(files)/consts'
</script>

<style scoped lang="scss"></style>
