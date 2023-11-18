<template>
  <v-app :theme="theme">
    <v-main class="main-content">
      <v-container class="main-content__page">
        <NuxtPage />
      </v-container>
    </v-main>
    <GeneralSnackbar />
  </v-app>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useConfigsStore } from '~/stores/config'
import GeneralSnackbar from '~/components/partials/GeneralSnackbar.vue'

export default {
  components: {
    GeneralSnackbar
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(useConfigsStore, ['theme'])
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  &__page {
    padding: 0 !important;
    height: 100%;
    width: 100%;
    min-height: 100vh;
  }
}

@import '@/assets/styles/main.scss';
</style>
