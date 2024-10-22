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
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import DashboardNavigator from '~/components/partials/DashboardNavigator.vue'
import { useRegularAuthStore } from '~/stores/regular-auth'
import { useConfigsStore } from '~/stores/config'
import { useAuthStore } from '~/stores/auth'

const { theme } = storeToRefs(useConfigsStore())
const { user, authenticated } = storeToRefs(useRegularAuthStore())

const { logout } = useAuthStore()
const { switchTheme, changeTheme } = useConfigsStore()

const elevation = computed(() => (drawer.value ? 2 : 0))

const drawer = ref(false)
const currentPage = ref('')
</script>
<style lang="scss"></style>
