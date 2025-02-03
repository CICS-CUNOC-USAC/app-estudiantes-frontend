<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:people"
          class="mb-1 mr-1.5 inline-block"
        />
        Mi perfil
      </h1>
      <CButton
        icon="icon-park-twotone:write"
        variant="link"
        label="Editar"
        class="mb-4 text-muted-color-emphasis lg:my-3"
        to="/dashboard/profile/edit"
      />
    </header>
    <PersonalInfoDetails :src="user" />
    <!-- <section class="profile-edit-section">
    </section> -->
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import CButton from '~/components/primitives/button/CButton.vue'
import PersonalInfoDetails from '~/components/profile/details/PersonalInfoDetails.vue'

const authStore = useAuthStore()
await authStore.fetchUser()
const regularAuthStore = useRegularAuthStore()
const { user } = storeToRefs(regularAuthStore)
definePageMeta({
  layout: 'dashboard'
})
</script>