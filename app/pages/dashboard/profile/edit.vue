<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:people"
          class="mb-1 mr-1.5 inline-block"
        />
        Editar perfil
      </h1>
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar"
        class="mb-4 text-muted-color-emphasis lg:my-3"
        to="/dashboard/profile"
      />
    </header>
    <section class="profile-edit-section">
      <PersonalInfoForm
        :src="user"
        :loading="loading"
        @save="updateProfile($event)"
      />
    </section>
    <section class="profile-edit-section">
      <PasswordProfileForm
        :src="user"
        :loading="loading"
        @save-password="updateProfile($event)"
      />
    </section>
  </main>
</template>
<script lang="ts" setup>
import PersonalInfoForm from '~/components/profile/PersonalInfoForm.vue'
import PasswordProfileForm from '~/components/profile/PasswordProfileForm.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import { mapActions, mapState, type Pinia } from 'pinia';

const authStore = useAuthStore()
await authStore.fetchUser()

const { user, loading } = storeToRefs(useRegularAuthStore())

const { updateProfile } = useRegularAuthStore()

definePageMeta({
  layout: 'dashboard'
})
</script>
