<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:id-card-h"
          class="mr-1.5 mb-1 inline-block"
        />
        Roles
      </h1>
    </header>

    <div class="my-4">
      <CButton
        label="Nuevo rol"
        icon="icon-park-outline:plus"
        class="w-fit"
        to="/admin/roles/create"
      />
    </div>

    <section class="mt-2 mb-6 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
      <div
        v-for="role in roles?.results"
        :key="role.id"
        class="dark:bg-surface-800 rounded-lg border border-black/70 bg-white px-4.5 py-4 dark:border-neutral-700"
      >
        <h2 class="text-lg font-medium">{{ role.name }}</h2>
        <p class="text-muted-color-emphasis">{{ role.description }}</p>

        <div class="bg-surface-300 dark:bg-surface-600 -mx-4.5 my-4 h-px" />

        <footer class="mt-2.5 flex gap-x-1.5">
          <CButton
            variant="tonal"
            label="Editar"
            size="small"
            icon="icon-park-twotone:edit"
          />
        </footer>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
import { getAllRoles } from '~/lib/api/admin/roles'

const {
  data: roles,
  status,
  error
} = await useAsyncData('roles', () => getAllRoles())

definePageMeta({
  layout: 'admin'
})
</script>
<style scoped></style>
