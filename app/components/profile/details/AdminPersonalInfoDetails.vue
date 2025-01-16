<template>
  <div v-if="user">
    <h3 class="my-2 text-lg font-semibold">Información personal</h3>
    <section class="mb-6 mt-2 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
      <CInputText
        id="first_name"
        v-model="user.first_name"
        label="Nombre(s)"
        readonly
        no-borders
        prepend-icon="icon-park-twotone:people"
      />
      <CInputText
        id="last_name"
        v-model="user.last_name"
        label="Apellido(s)"
        readonly
        no-borders
        prepend-icon="icon-park-twotone:people"
      />

      <CInputText
        id="email"
        v-model="user.email"
        label="Correo electrónico"
        readonly
        no-borders
        prepend-icon="icon-park-twotone:mail"
      />
    </section>
  </div>
</template>
<script setup lang="ts">
import CInputText from '~/components/primitives/form/CInputText.vue';

defineProps<{
  user: Staff | null
}>()
</script>
<style lang="scss" scoped></style>
