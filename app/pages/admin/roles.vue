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

    <section class="mt-2 mb-6 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
      <div
        v-for="role in roles?.results"
        :key="role.id"
        class="rounded-lg bg-white border border-black/70 px-4.5 py-4 dark:border-neutral-700"
      >
        <h2 class="text-lg font-medium">{{ role.name }}</h2>
        <p class="text-muted-color-emphasis">{{ role.description }}</p>

        <div class="bg-gray-200 h-px my-4 -mx-3"></div>


        <footer class="flex mt-2.5 gap-x-1.5">
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
import CButton from '~/components/primitives/button/CButton.vue';
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
