<template>
  <!-- <ContentDisplay :data /> -->
   <nav class="space-x-4">
      <Button
        icon="lucide:megaphone"
        variant="link"
        label="Ver comunicados del CICS"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/portal/asociaciones/cics/comunicados"
      />
    </nav>
  <div class="mx-auto content-renderer" v-if="data">
    <StrapiBlocks :content="data?.data.content" />
  </div>
</template>
<script lang="ts" setup>
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
import Button from '~/components/ui/button/Button.vue'
const { data } = await useAsyncData('cics-aso', () => $strapi('/cics-aso'))
</script>
<style lang="css">
@reference '~/assets/css/main.css';

</style>