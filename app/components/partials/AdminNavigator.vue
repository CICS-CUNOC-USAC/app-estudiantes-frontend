<template>
  <div>
    <v-container align="center">
      <!--Logo USAC (sujeto a cambios), se usa un filtro para volverlo gris para que se vea en ambos theme (sujeto a cambios)-->
      <img
        alt="Logo USAC"
        class="logo"
        src="@/assets/img/usac-logo.svg"
        width="125"
        height="125"
        style="filter: invert(50%); margin-top: 10px; margin-bottom: -5px"
      />
    </v-container>
    <v-list density="compact">
      <v-list-item
        prepend-icon="mdi-home-outline"
        class="rounded-lg"
        active-class="bg-orange-accent-4 rounded-pill"
        to="/admin/home"
      >
        <v-list-item-title> Tablero </v-list-item-title>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-account-outline"
        class="rounded-lg"
        active-class="bg-orange-accent-4 rounded-pill"
        to="/admin/me"
      >
        <v-list-item-title> Perfil </v-list-item-title>
      </v-list-item>
      <v-divider thickness="2" />
      <span class="text-overline"> Recursos </span>
      <v-list-item
        v-for="([icon, title, route], i) in basicInfoItems"
        :key="i"
        :prepend-icon="icon"
        :to="route"
        class="rounded-lg"
        active-class="bg-orange-accent-4 rounded-pill"
      >
        <v-list-item-title>
          {{ title }}
        </v-list-item-title>
      </v-list-item>

      <v-divider thickness="2" />
      <v-list-item
        prepend-icon="mdi-keyboard-backspace"
        class="rounded-lg"
        active-class="bg-orange-accent-4 rounded-pill"
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
export default {
  emits: ['theme'],
  data() {
    return {
      basicInfoItems: [
        // ['mdi-newspaper', 'Artículos', '/admin/articles'],
        ['mdi-book-open-page-variant', 'Manuales', '/admin/manuals'],
        [
          'mdi-account-group-outline',
          'Usuarios Administrativos',
          '/admin/users'
        ],
        ['mdi-book-open-page-variant', 'Libreria', '/admin/books']
        // ['mdi-bookshelf', 'Biblioteca', '/admin/library'],
        // ['mdi-book-open-page-variant', 'Tesario', '/admin/thesis']
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
<style scoped>
.v-list-item {
  margin-left: 7%;
  margin-right: 7%;
  margin-bottom: 1.5%;
  font-size: 1rem;
  height: 45px !important;
}
.v-list-item-title {
  font-size: 1rem !important;
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
