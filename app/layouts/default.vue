<template>
  <v-app :theme="theme">
    <v-app-bar class="app-bar" :elevation="elevation">
      <v-btn icon="mdi-menu" @click="drawer = !drawer" />
      <v-app-bar-title class="mt-n1">
        <strong>Portal </strong> - CICS APP
      </v-app-bar-title>
      <div v-if="!user" class="app-bar__user-info">
        <!-- Dashboard action (regular and admin) -->
        <v-tooltip text="Iniciar sesión" location="bottom">
          <template #activator="{ props }">
            <v-btn to="/login" v-bind="props" class="app-bar__avatar" icon>
              <v-icon> mdi-account-circle-outline </v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
      <div v-if="user && loggedUser?.profile" class="app-bar__user-info">
        <!-- Dashboard action (regular and admin) -->
        <v-tooltip text="Mi espacio" location="bottom">
          <template #activator="{ props }">
            <v-avatar
              v-bind="props"
              class="app-bar__avatar text-accent-4"
              @click="$router.push('/dashboard/home')"
            >
              <v-icon> mdi-view-dashboard-outline </v-icon>
            </v-avatar>
          </template>
        </v-tooltip>
        <!-- If user is logged in -->
        <v-tooltip text="Mi perfil" location="bottom">
          <template #activator="{ props }">
            <v-avatar
              v-bind="props"
              class="app-bar__avatar text-accent-4"
              @click="$router.push('/dashboard/profile')"
            >
              <strong>
                {{ loggedUser?.profile?.first_name[0]
                }}{{ loggedUser?.profile?.last_name[0] }}
              </strong>
            </v-avatar>
          </template>
        </v-tooltip>
      </div>
      <div v-if="user && !loggedUser?.profile" class="app-bar__user-info">
        <!-- Dashboard action (regular and admin) -->
        <v-tooltip text="Administración" location="bottom">
          <template #activator="{ props }">
            <v-avatar
              v-bind="props"
              class="app-bar__avatar text-accent-4"
              @click="$router.push('/dashboard/home')"
            >
              <v-icon> mdi-view-dashboard-outline </v-icon>
            </v-avatar>
          </template>
        </v-tooltip>
        <!-- If user is logged in -->
        <v-tooltip text="Mi perfil" location="bottom">
          <template #activator="{ props }">
            <v-avatar
              v-bind="props"
              class="app-bar__avatar text-accent-4"
              @click="$router.push('/dashboard/profile')"
            >
              <strong>
                {{ loggedStaff?.first_name[0] }}{{ loggedStaff?.last_name[0] }}
              </strong>
            </v-avatar>
          </template>
        </v-tooltip>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" disable-resize-watcher width="350">
      <SidebarNavigator />
    </v-navigation-drawer>

    <v-main class="d-flex flex-column">
      <v-container class="page-v-container" style="flex-grow: 1">
        <NuxtPage />
      </v-container>

      <v-footer style="flex-grow: 0" class="pa-4">
        <v-col class="text-center" cols="12">
          <strong>CICS</strong> — {{ new Date().getFullYear() }}
        </v-col>
      </v-footer>
    </v-main>
    <GeneralSnackbar />
  </v-app>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia'
import { useConfigsStore } from '~/stores/config'
import SidebarNavigator from '~/components/partials/SidebarNavigator.vue'
import { useAuthStore } from '~/stores/auth'
import { type User } from '~/stores/regular-auth'
import { type Staff } from '~/stores/staff-auth'
import GeneralSnackbar from '~/components/partials/GeneralSnackbar.vue'
export default {
  components: {
    SidebarNavigator,
    GeneralSnackbar
  },
  data() {
    return {
      drawer: true,
      currentPage: ''
    }
  },
  computed: {
    ...mapState(useConfigsStore, ['theme']),
    ...mapState(useAuthStore, ['user', 'role']),
    elevation() {
      return this.drawer ? 2 : 0
    },
    loggedUser() {
      return this.user as User
    },
    loggedStaff() {
      return this.user as Staff
    }
  },
  methods: {
    ...mapActions(useConfigsStore, ['switchTheme', 'changeTheme'])
    // changeTheme() {
    //   this.switchTheme()
    // }
  }
}
</script>
<style lang="scss" scoped>
.app-bar {
  padding: 0 1rem 0 0;
  &__user-info {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }
  &__avatar {
    cursor: pointer;
    outline: 1px solid #ccc;
    transition: outline 0.07s linear;

    &:hover {
      outline: 3px solid #ccc;
    }
  }
}
</style>
