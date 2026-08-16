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
      <Button
        icon="icon-park-twotone:write"
        variant="link"
        label="Editar"
        class="mb-4 text-muted-color-emphasis lg:my-3"
        to="/dashboard/profile/edit"
      />
    </header>
    <PersonalInfoDetails :src="user" />
    <SessionsInfo role="regular" />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Button from '~/components/ui/button/Button.vue'
import PersonalInfoDetails from '~/components/profile/details/PersonalInfoDetails.vue'
import SessionsInfo from '~/components/profile/details/SessionsInfo.vue'

const authStore = useAuthStore()
await authStore.fetchUser()
const regularAuthStore = useRegularAuthStore()
const { user } = storeToRefs(regularAuthStore)
definePageMeta({
  layout: 'dashboard'
})
</script>