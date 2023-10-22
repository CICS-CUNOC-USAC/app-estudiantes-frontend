<template>
  <main>
    <header class="mb-4">
      <h1>Editar perfil</h1>
      <v-btn prepend-icon="mdi-arrow-left" to="/dashboard/profile" class="mt-3">
        Regresar
      </v-btn>
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
import { mapState, mapActions, Pinia } from 'pinia'
import PersonalInfoForm from '~/components/profile/PersonalInfoForm.vue'
import PasswordProfileForm from '~/components/profile/PasswordProfileForm.vue'

export default defineNuxtComponent({
  asyncData({ $pinia }: { $pinia: Pinia }) {
    const store = useAuthStore($pinia)
    store.fetchUser()
    return {}
  },
  components: {
    PersonalInfoForm,
    PasswordProfileForm
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
