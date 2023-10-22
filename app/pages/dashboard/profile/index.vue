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
<script lang="ts">
import { mapState, mapActions, Pinia } from 'pinia'
import PersonalInfoDetails from '@/components/profile/details/PersonalInfoDetails.vue'

export default defineNuxtComponent({
  asyncData({ $pinia }: { $pinia: Pinia }) {
    const store = useAuthStore($pinia)
    store.fetchUser()
    return {}
  },
  components: {
    PersonalInfoDetails
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
