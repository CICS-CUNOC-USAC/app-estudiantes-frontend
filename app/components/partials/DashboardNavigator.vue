<template>
  <div>
    <v-container align="center">
      <CICSLogo />
    </v-container>
    <v-list density="compact">
      <v-list-item
        prepend-icon="mdi-home-outline"
        class="rounded-lg"
        active-class="bg-accent-4 rounded-pill active-item"
        to="/dashboard/home"
      >
        <v-list-item-title> Tablero </v-list-item-title>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-account-outline"
        class="rounded-lg"
        active-class="bg-accent-4 rounded-pill active-item"
        to="/dashboard/profile"
      >
        <v-list-item-title> Perfil </v-list-item-title>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-wifi-cog"
        class="rounded-lg"
        active-class="bg-accent-4 rounded-pill active-item"
        to="/dashboard/wi-fi"
      >
        <v-list-item-title> Acceso WiFi </v-list-item-title>
      </v-list-item>
      <v-divider thickness="2" />
      <span class="text-overline"> Mis recursos </span>
      <v-list-item
        v-for="([icon, title, route], i) in basicInfoItems"
        :key="i"
        :prepend-icon="icon"
        :to="route"
        class="rounded-lg"
        active-class="bg-accent-4 rounded-pill active-item"
      >
        <v-list-item-title>
          {{ title }}
        </v-list-item-title>
      </v-list-item>

      <v-divider thickness="2" />
      <v-list-item
        prepend-icon="mdi-keyboard-backspace"
        class="rounded-lg"
        active-class="bg-accent-4 rounded-pill active-item"
        to="/"
      >
        <v-list-item-title> Regresar al portal </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>
<script lang="ts">
import { mapWritableState } from 'pinia'
import { useConfigsStore } from '~/stores/config'
import CICSLogo from './CICSLogo.vue'
export default {
  components: { CICSLogo },
  emits: ['theme'],
  data() {
    return {
      basicInfoItems: [
        // ['mdi-calendar-month-outline', 'Horarios', '/portal/general/horarios'],
        [
          'mdi-card-bulleted-settings-outline',
          'Pensums',
          '/dashboard/pensum/progress'
        ],
        [
          'mdi-book-open-page-variant-outline',
          'Biblioteca / Libros',
          '/dashboard/books'
        ]
      ],
      theme: 'light',
      tools: []
    }
  },
  computed: {
    ...mapWritableState(useConfigsStore, ['themeBoolean'])
  },
  methods: {
    changeTheme() {
      this.$emit('theme')
    }
  }
}
</script>
<style scoped lang="scss">
.active-item {
  :deep(.v-list-item__content .v-list-item-title) {
    font-weight: bold !important;
    font-size: 1.12rem !important;
    transform: translateX(4px) !important;
  }
}
.v-list-item {
  margin-left: 7%;
  margin-right: 7%;
  margin-bottom: 1.5%;
  font-size: 1rem;
  height: 45px !important;
  :deep(.v-list-item__content .v-list-item-title) {
    transition:
      font-size 0.1s ease-out,
      transform 0.1s ease-out !important;
  }
}

span {
  margin-left: 8.5%;
  font-weight: bold;
}
.v-divider {
  margin: 5%;
  width: 90%;
}
</style>
