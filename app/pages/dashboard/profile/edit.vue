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
        @save-password="updateUserPassword($event)"
      />
    </section>
  </main>
</template>
<script lang="ts">
import { mapState, mapActions, type Pinia } from 'pinia'
import PersonalInfoForm from '~/components/profile/PersonalInfoForm.vue'
import PasswordProfileForm from '~/components/profile/PasswordProfileForm.vue'
import CButton from '~/components/primitives/button/CButton.vue';

export default defineNuxtComponent({
  asyncData({ $pinia }: { $pinia: Pinia }) {
    const store = useAuthStore($pinia)
    store.fetchUser()
    return {}
  },
  components: {
    PersonalInfoForm,
    PasswordProfileForm,
    CButton
  },
  setup() {
    definePageMeta({
      layout: 'dashboard'
    })
  },
  computed: {
    ...mapState(useRegularAuthStore, ['user', 'authenticated']),
    ...mapState(useRegularAuthStore, ['loading'])
  },
  methods: {
    updateUserProfile(user: UserUpdatePayload) {
      this.updateProfile(user)
    },
    updateUserPassword(userWithPassword: UserUpdatePayload) {
      this.updateProfile(userWithPassword)
    },
    ...mapActions(useRegularAuthStore, ['myProfile', 'updateProfile']),
    ...mapActions(useAuthStore, ['logout'])
  }
})
</script>
<style lang="scss" scoped>
.profile-edit-section {
  margin-bottom: 1.5rem;
}
</style>
