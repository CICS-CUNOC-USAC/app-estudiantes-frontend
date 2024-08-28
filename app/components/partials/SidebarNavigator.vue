<template>
  <div class="mb-16">
    <v-container align="center">
      <CICSLogo />
    </v-container>
    <v-list density="compact">
      <v-list-item
        prepend-icon="mdi-home-outline"
        active-class="bg-accent-3 rounded-pill active-item"
        title="Inicio"
        class="rounded-lg"
        to="/"
      >
        <!-- <v-list-item-title> Inicio </v-list-item-title> -->
      </v-list-item>
      <v-divider thickness="2" />
      <span class="text-overline"> informacion básica </span>
      <v-list-item
        v-for="([icon, title, route], i) in basicInfoItems"
        :key="i"
        :prepend-icon="icon"
        :to="route"
        class="rounded-lg"
        active-class="bg-accent-3 rounded-pill active-item"
      >
        <v-list-item-title>
          {{ title }}
        </v-list-item-title>
      </v-list-item>

      <v-divider thickness="2" />
      <span class="text-overline"> asociaciones </span>
      <v-list-item
        v-for="([icon, title, route], i) in associations"
        :key="i"
        :prepend-icon="icon"
        :to="route"
        class="rounded-lg"
        active-class="bg-accent-3 rounded-pill active-item"
      >
        <v-list-item-title>
          {{ title }}
        </v-list-item-title>
      </v-list-item>

      <v-divider thickness="2" />
      <span class="text-overline"> recursos </span>
      <v-list-item
        v-for="([icon, title, route, disabled], i) in resources"
        :key="i"
        :disabled="disabled"
        :prepend-icon="icon"
        :to="route"
        class="rounded-lg"
        active-class="bg-accent-3 rounded-pill active-item"
      >
        <v-list-item-title>
          {{ title }}
        </v-list-item-title>
      </v-list-item>

      <v-list-group value="Herramientas">
        <template #activator="{ props }">
          <v-list-item
            disabled
            v-bind="props"
            class="rounded-lg"
            active-class="bg-accent-3 rounded-pill active-item"
            prepend-icon="mdi-toolbox-outline"
          >
            <v-list-item-title> Herramientas </v-list-item-title>
          </v-list-item>
        </template>
      </v-list-group>

      <v-divider thickness="2" />
      <span class="text-overline"> extra </span>
      <v-list-item
        prepend-icon="mdi-information-outline"
        to="/portal/extras/about"
        class="rounded-lg"
        active-class="bg-accent-3 rounded-pill active-item"
      >
        <v-list-item-title> Acerca de </v-list-item-title>
      </v-list-item>
      <v-list-item
        title="Configuración"
        to="/portal/extras/config"
        class="rounded-lg"
        prepend-icon="mdi-cog-outline"
        active-class="bg-accent-3 rounded-pill active-item"
      ></v-list-item>
      <!-- <v-container align="center">
        <v-switch
          v-model="themeBoolean"
          :prepend-icon="'mdi-weather-sunny'"
          inset
          :append-icon="'mdi-weather-night'"
          style="width: 45%"
          @click="changeTheme"
        />
      </v-container> -->
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
  setup() {
    const { changeTheme } = useConfigsStore()
    return { changeTheme }
  },
  data() {
    return {
      themeSwitch: true,
      basicInfoItems: [
        [
          'mdi-post-outline',
          'Publicaciones Oficiales',
          '/portal/general/publicaciones'
        ],
        ['mdi-calendar-month-outline', 'Horarios', '/portal/general/horarios'],
        [
          'mdi-card-bulleted-settings-outline',
          'Programas de curso',
          '/portal/general/cursos/programas'
        ],
        [
          'mdi-card-bulleted-settings-outline',
          'Pensums',
          '/portal/general/pensums'
        ],
        [
          'mdi-help-box-outline',
          'FAQ | Primer Ingreso',
          '/portal/general/faq-primer-ingreso'
        ],
        ['mdi-help-box-outline', 'FAQ', '/portal/general/faq']
      ] as const,
      associations: [
        ['mdi-account-group-outline', 'CICS', '/portal/asociaciones/cics'],
        ['mdi-account-group-outline', 'AEIO', '/portal/asociaciones/aeio']
      ],
      resources: [
        [
          'mdi-file-document-multiple-outline',
          'Manuales',
          '/portal/recursos/manuales'
        ],
        [
          'mdi-book-account-outline',
          'Tesario',
          '/portal/recursos/tesario',
          true
        ]
      ] as const,
      // theme: 'light',
      tools: []
    }
  },
  computed: {
    ...mapWritableState(useConfigsStore, ['themeBoolean', 'theme'])
  },
  methods: {
    // changeTheme() {
    //   this.$emit('theme')
    // }
  }
}
</script>
<style scoped lang="scss">
.active-item {
  :deep(.v-list-item__content .v-list-item-title) {
    font-weight: bold !important;
    font-size: 1.1rem !important;
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
