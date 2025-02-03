<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:peoples"
          class="mr-1.5 mb-1 inline-block"
        />
        Usuarios administrativos
      </h1>
    </header>
    <p class="mt-2">
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

