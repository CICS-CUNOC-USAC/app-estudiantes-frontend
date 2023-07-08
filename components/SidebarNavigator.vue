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
        style="filter: invert(50%); margin-top: 10px; margin-bottom: -5px;"
      >
    </v-container>
    <v-list density="compact">
      <v-list-item
        prepend-icon="mdi-home-outline"
        class="rounded-lg"
        active-class="bg-orange-accent-4 rounded-pill"
        to="/"
      >
        <v-list-item-title>
          Inicio
        </v-list-item-title>
      </v-list-item>
      <v-divider
        thickness="2"
      />
      <p class="text-overline">
        informacion basica
      </p>
      <v-list-item
        v-for="([icon,title,route], i) in basicInfoItems"
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

      <v-divider
        thickness="2"
      />
      <p class="text-overline">
        asociaciones
      </p>
      <v-list-item
        v-for="([icon,title,route], i) in associations"
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

      <v-divider
        thickness="2"
      />
      <p class="text-overline">
        recursos
      </p>
      <v-list-item
        v-for="([icon,title,route], i) in resources"
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

      <v-list-group value="Herramientas">
        <template #activator="{ props }">
          <v-list-item
            disabled
            v-bind="props"
            class="rounded-lg"
            active-class="bg-orange-accent-4 rounded-pill"
            prepend-icon="mdi-toolbox-outline"
          >
            <v-list-item-title>
              Herramientas
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list-group>

      <v-divider
        thickness="2"
      />
      <p class="text-overline">
        extra
      </p>
      <v-list-item
        prepend-icon="mdi-information-outline"
        to="/extras/about"
        class="rounded-lg"
        active-class="bg-orange-accent-4 rounded-pill"
      >
        <v-list-item-title>
          Acerca de
        </v-list-item-title>
      </v-list-item>
      <v-container align="center">
        <v-switch
          v-model="modelSwitch"
          :prepend-icon="'mdi-weather-sunny'"
          inset
          :append-icon="'mdi-weather-night'"
          style="width:45%;"
          @click="changeTheme"
        />
      </v-container>
    </v-list>
  </div>
</template>
<script lang="ts">
export default {
  emits: ['theme'],
  data () {
    return {
      basicInfoItems: [
        ['mdi-calendar-month-outline', 'Horarios', '/general/horarios'],
        ['mdi-card-bulleted-settings-outline', 'Pensums', '/general/pensums'],
        ['mdi-help-box-outline', 'FAQ | Primer Ingreso', '/general/faq-primer-ingreso'],
        ['mdi-help-box-outline', 'FAQ', '/general/faq']
      ],
      associations: [
        ['mdi-account-group-outline', 'CICS', '/asociaciones/cics'],
        ['mdi-account-group-outline', 'AEIO', '/asociaciones/aeio']
      ],
      resources: [
        ['mdi-file-document-multiple-outline', 'Manuales', '/recursos/manuales'],
        ['mdi-book-open-page-variant-outline', 'Biblioteca', '/recursos/biblioteca'],
        ['mdi-book-account-outline', 'Tesario', '/recursos/tesario']
      ],
      theme: 'light',
      tools: [
      ]
    }
  },
  computed: {
    modelSwitch () { return this.theme !== 'light' }
  },
  methods: {
    changeTheme () {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.$emit('theme', this.theme)
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
  font-size: 1.1rem !important;
}

p {
  margin-left: 8.5%;
  font-weight: bold;
}
.v-divider  {
  margin: 5%;
  width: 90%;
}
</style>
