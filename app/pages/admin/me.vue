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
    </header>
    <AdminPersonalInfoDetails :user="user" />
    <!-- <section class="profile-edit-section">
    </section> -->
  </main>
  <!-- <main>
    <header class="mb-4">
      <h1>Mi perfil</h1>
      <v-btn
        prepend-icon="mdi-pencil-outline"
        to="/admin/profile/edit"
        class="mt-3"
      >
        Editar
      </v-btn>
    </header>
    <section class="profile-edit-section">
      <AdminPersonalInfoDetails :user="user" />
    </section>
  </main> -->
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
