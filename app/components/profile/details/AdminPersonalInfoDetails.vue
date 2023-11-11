<template>
  <section>
    <div>
      <h2 class="font-weight-light">Perfil</h2>
      <h3 class="mb-4 text-overline">Información personal</h3>
      <v-row>
        <v-col cols="6">
          <v-text-field
            :model-value="user.first_name"
            readonly
            variant="solo"
            label="Nombre(s)"
          >
            <template #prepend>
              <v-icon icon="mdi-account-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            :model-value="user.last_name"
            readonly
            variant="solo"
            label="Apellido(s)"
          >
            <template #prepend>
              <v-icon icon="mdi-account-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-text-field
            :model-value="user.email"
            readonly
            variant="solo"
            label="Correo electrónico"
          >
            <template #prepend>
              <v-icon icon="mdi-email-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </div>
  </section>
</template>
<script setup lang="ts">
defineProps<{
  user: Staff | null
}>()
</script>
<style lang="scss" scoped></style>
