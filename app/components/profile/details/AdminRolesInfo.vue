<template>
  <div>
    <h3 class="mb-4 text-lg font-semibold">Roles asignados</h3>

    <section class="mt-2 mb-6 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
      <div
        v-for="role in user?.roles"
        :key="role.id"
        class="bg-surface-50 dark:bg-surface-900 rounded-lg border border-black/80 p-4 dark:border-neutral-700"
      >
        <div class="mb-3">
          <h4
            class="text-lg font-semibold "
          >
            {{ role.name }}
          </h4>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Alias:
            <span class="font-medium text-muted-color-emphasis">{{
              role.alias
            }}</span>
          </p>
        </div>
        <div>
          <h5
            class="mb-2 text-sm font-semibold "
          >
            Permisos:
          </h5>
          <div
            v-for="permission in role.permissions"
            :key="permission.id"
            class="mb-2 rounded-lg bg-neutral-200 py-2 pl-3 dark:bg-neutral-800"
          >
            <h6
              class="text-sm font-medium "
            >
              {{ permission.name }}
            </h6>
            <p class="text-xs  text-muted-color">
              {{ permission.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  user?: Staff | null
}>()
</script>
<style scoped></style>
