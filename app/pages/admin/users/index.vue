<template>
  <main>
    <h1 class="mb-4">Usuarios Administrativos</h1>
    <p class="font-weight-light my-4">
      En esta sección podrás manejar a los usuarios administrativos y sus roles.
    </p>
    <StaffsView />
  </main>
</template>
<script setup lang="ts">
import StaffsView from '@/components/admin/staffs/StaffsView.vue'
definePageMeta({
  layout: 'admin'
})
</script>
<style lang="scss" scoped></style>
