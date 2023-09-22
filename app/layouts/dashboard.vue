<template>
  <v-app :theme="theme">
    <v-app-bar :elevation="elevation">
      <template #prepend>
        <v-btn
          :icon="drawer ? 'mdi-backburger' : 'mdi-menu'"
          @click="drawer = !drawer"
        />
      </template>

      <v-app-bar-title class="mt-n1">
        <strong>Dashboard </strong> - CICS APP
      </v-app-bar-title>

      <v-tooltip text="Cerrar sesión" location="bottom">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" @click="logout">
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
      <DashboardNavigator @theme="(theme: string) => changeTheme()" />
    </v-navigation-drawer>

    <v-main>
      <v-container class="page-v-container">
        <NuxtPage :theme="theme" />
      </v-container>
      <!-- <v-footer
        :color="theme === 'light' ? 'white' : '#121212'"
        justify="center"
      >
        <v-col class="text-center mt-4" cols="12">
          <strong>CICS</strong> — {{ new Date().getFullYear() }}
        </v-col>
      </v-footer> -->
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia'
import DashboardNavigator from '~/components/partials/DashboardNavigator.vue'
import { useRegularAuthStore } from '~/stores/regular-auth'
import { useConfigsStore } from '~/stores/config'
import { useAuthStore } from '~/stores/auth'
export default {
  components: {
    DashboardNavigator
  },
  data() {
    return {
      drawer: false,
      currentPage: ''
    }
  },
  computed: {
    ...mapState(useConfigsStore, ['theme']),
    ...mapState(useRegularAuthStore, ['user', 'authenticated']),
    elevation() {
      return this.drawer ? 2 : 0
    }
  },
  methods: {
    ...mapActions(useConfigsStore, ['switchTheme']),
    changeTheme() {
      this.switchTheme()
    },
    ...mapActions(useAuthStore, ['logout'])
  }
}
</script>
<style lang="scss"></style>
