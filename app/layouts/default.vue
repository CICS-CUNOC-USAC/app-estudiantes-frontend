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
              class="app-bar__avatar"
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
              class="app-bar__avatar"
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
              class="app-bar__avatar"
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
              class="app-bar__avatar"
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

    <v-navigation-drawer
      v-model="drawer"
      :width="$vuetify.display.mdAndUp ? 340 : 300"
    >
      <SidebarNavigator @theme="(theme: string) => changeTheme()" />
    </v-navigation-drawer>

    <v-main>
      <v-container class="page-v-container">
        <NuxtPage />
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
import { useConfigsStore } from '~/stores/config'
import SidebarNavigator from '~/components/partials/SidebarNavigator.vue'
import { useAuthStore } from '~/stores/auth'
import { User } from '~/stores/regular-auth'
import { Staff } from '~/stores/staff-auth'
export default {
  components: {
    SidebarNavigator
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
    ...mapActions(useConfigsStore, ['switchTheme']),
    changeTheme() {
      this.switchTheme()
    }
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
