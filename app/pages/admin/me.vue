<template>
  <main>
    <header class="mb-4">
      <h1>Mi perfil</h1>
      <!-- <v-btn
        prepend-icon="mdi-pencil-outline"
        to="/admin/profile/edit"
        class="mt-3"
      >
        Editar
      </v-btn> -->
    </header>
    <section class="profile-edit-section">
      <AdminPersonalInfoDetails :user="user" />
    </section>
  </main>
</template>
<script lang="ts" setup>
import AdminPersonalInfoDetails from '~/components/profile/details/AdminPersonalInfoDetails.vue'
const { user } = storeToRefs(useStaffAuthStore())
const staffAuthStore = useStaffAuthStore()
await staffAuthStore.myProfile()
definePageMeta({
  layout: 'admin'
})
</script>
<style lang="scss"></style>
