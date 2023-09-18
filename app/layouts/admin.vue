<template>
  <v-app :theme="theme">
    <v-app-bar
      :color="theme === 'light' ? 'white ' : '#121212'"
      :elevation="elevation"
    >
      <template #prepend>
        <v-btn
          :icon="drawer ? 'mdi-backburger' : 'mdi-menu'"
          @click="drawer = !drawer"
        />
      </template>

      <v-app-bar-title class="mt-n1">
        <strong>Administración </strong> - CICS APP
        <!-- <v-spacer /> -->
      </v-app-bar-title>

      <v-tooltip text="Cerrar sesión" location="bottom">
        <template #activator="{ props }">
          <v-btn to="/login" icon v-bind="props">
            <v-icon> mdi-logout-variant </v-icon>
          </v-btn>
          <span class="mr-4">
            {{ user?.profile?.first_name }} {{ user?.profile?.last_name }}
          </span>
        </template>
      </v-tooltip>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :width="$vuetify.display.mdAndUp ? 340 : 300"
    >
      <AdminNavigator @theme="(theme: string) => changeTheme(theme)" />
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <NuxtPage
          :theme="theme"
          class="ma-4"
          @current-page="currentPage = $event"
        />
      </v-container>
      <v-footer
        :color="theme === 'light' ? 'white' : '#121212'"
        justify="center"
      >
        <v-col class="text-center mt-4" cols="12">
          <strong>CICS</strong> — {{ new Date().getFullYear() }}
        </v-col>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia'
import AdminNavigator from '~/components/partials/AdminNavigator.vue'
import { useRegularAuthStore } from '~/stores/regular-auth'
export default {
  components: {
    AdminNavigator
  },
  data() {
    return {
      drawer: true,
      theme: 'light',
      currentPage: ''
    }
  },
  computed: {
    ...mapState(useRegularAuthStore, ['user', 'authenticated']),
    elevation() {
      return this.drawer ? 2 : 0
    }
  },
  methods: {
    changeTheme(value: string) {
      this.theme = value
    },
    ...mapActions(useRegularAuthStore, ['myProfile', 'logoutUser'])
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/main.scss';
</style>
