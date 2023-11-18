<template>
  <v-snackbar
    v-model="snackbarShow"
    vertical
    location="top center"
    rounded="xl"
  >
    <div
      class="text-overline pb-2 font-weight-bold d-flex align-center"
      :class="[colorSnackbar]"
    >
      <v-icon v-if="type === SnackbarType.ERROR" class="mr-2">
        mdi-alert-octagon-outline
      </v-icon>
      <v-icon v-if="type === SnackbarType.SUCCESS" class="mr-2">
        mdi-check-circle-outline
      </v-icon>
      <v-icon v-if="type === SnackbarType.WARNING" class="mr-2">
        mdi-alert-outline
      </v-icon>
      <v-icon v-if="type === SnackbarType.MESSAGE" class="mr-2">
        mdi-information-outline
      </v-icon>
      {{ title }}
    </div>

    <p>{{ message }}</p>

    <template #actions>
      <v-btn color="white" @click="hideSnackbar"> Cerrar </v-btn>
    </template>
  </v-snackbar>
</template>
<script lang="ts">
import { mapWritableState, mapActions } from 'pinia'
import { useSnackbarStore, SnackbarType } from '~/stores/snackbar'
export default {
  computed: {
    ...mapWritableState(useSnackbarStore, [
      'snackbarShow',
      'title',
      'message',
      'color',
      'type'
    ]),
    colorSnackbar() {
      switch (this.type) {
        case SnackbarType.ERROR:
          return 'text-red-lighten-1'
        case SnackbarType.SUCCESS:
          return 'text-teal'
        case SnackbarType.WARNING:
          return 'text-yellow'
        case SnackbarType.MESSAGE:
          return 'text-cyan'
        default:
          return 'text-white'
      }
    }
  },
  methods: {
    ...mapActions(useSnackbarStore, ['showSnackbar', 'hideSnackbar'])
  }
}
</script>
<style lang=""></style>
