<template>
  <main>
    <div class="app-bar" :elevation="elevation">
      <v-btn icon="mdi-menu" @click="drawer = !drawer" />
      <h1 class="mt-n1"><strong>Portal </strong> - CICS APP</h1>
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
    </div>

    <div disable-resize-watcher width="350">
      <!-- <SidebarNavigator /> -->
    </div>

    <div class="d-flex flex-column">
      <div id="appcont" class="page-v-container" style="flex-grow: 1">
        <NuxtPage />
      </div>

      <!-- <v-footer style="flex-grow: 0" class="pa-4">
        <v-col class="text-center" cols="12">
          <strong>CICS</strong> — {{ new Date().getFullYear() }}
        </v-col>
      </v-footer> -->
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useConfigsStore } from '~/stores/config'
import SidebarNavigator from '~/components/partials/SidebarNavigator.vue'
import { useAuthStore } from '~/stores/auth'
import { type User } from '~/stores/regular-auth'
import { type Staff } from '~/stores/staff-auth'

const { user, role } = storeToRefs(useAuthStore())
const { theme } = storeToRefs(useConfigsStore())

const drawer = ref(false)
const currentPage = ref('')

const elevation = computed(() => (drawer.value ? 2 : 0))
const loggedUser = computed(() => user.value as User)
const loggedStaff = computed(() => user.value as Staff)
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
