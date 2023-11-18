<template>
  <main>
    <header class="mb-4">
      <h1>Mi perfil</h1>
      <v-btn
        prepend-icon="mdi-pencil-outline"
        to="/dashboard/profile/edit"
        class="mt-3"
      >
        Editar
      </v-btn>
    </header>
    <section class="profile-edit-section">
      <PersonalInfoDetails :src="user" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PersonalInfoDetails from '~/components/profile/details/PersonalInfoDetails.vue'

const authStore = useAuthStore()
await authStore.fetchUser()
const regularAuthStore = useRegularAuthStore()
const { user } = storeToRefs(regularAuthStore)
definePageMeta({
  layout: 'dashboard'
})
</script>

<style lang="scss" scoped>
.profile-edit-section {
  margin-bottom: 1.5rem;
}
</style>
