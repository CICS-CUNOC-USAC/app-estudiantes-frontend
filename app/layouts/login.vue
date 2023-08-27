<template>
  <v-app :theme="theme">
    <v-main>
      <v-container>
        <NuxtPage
          :theme="theme"
          class="ma-5 "
        />
      </v-container>
      <v-footer
        :color="theme === 'light' ? 'white':'#121212'"
        justify="center"
      >
        <v-col
          class="text-center mt-4"
          cols="12"
        >
          <strong>CICS</strong> — {{ new Date().getFullYear() }}
        </v-col>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default {
  data () {
    return {
      theme: 'light'
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/main.scss';
</style>
