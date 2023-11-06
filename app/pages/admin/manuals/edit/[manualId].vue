<template>
  <main>
    <h1>Editar manual</h1>
    <div v-if="loading">
      <v-skeleton-loader type="heading, paragraph, actions"></v-skeleton-loader>
    </div>
    <div v-if="manual && !loading">
      <v-row>
        <v-col cols="12" sm="4" align-self="center">
          <v-text-field
            v-model="manual.name"
            label="Nombre"
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-textarea
            v-model="manual.description"
            label="Descripción"
            no-resize
            :rows="3"
          ></v-textarea>
        </v-col>
        <v-col cols="12" sm="2" align-self="center">
          <div class="d-flex flex-column justify-center" style="gap: 12px">
            <v-btn prepend-icon="mdi-arrow-left" to="/admin/manuals"
              >Cancelar</v-btn
            >
            <v-btn prepend-icon="mdi-content-save-outline" @click="saveManual"
              >Guardar</v-btn
            >
          </div>
        </v-col>
      </v-row>
      <div>Aqui va el contenido/pdf del manual</div>
    </div>
    <div v-if="!manual && !loading">
      <ElementNotFound
        element-type="manual"
        back-to-route="/admin/manuals"
        back-to-label="Volver a la lista de manuales"
      />
    </div>
  </main>
</template>
<script lang="ts" setup>
import { VSkeletonLoader } from 'vuetify/lib/labs/VSkeletonLoader/index.mjs'
import ElementNotFound from '@/components/partials/ElementNotFound.vue'
definePageMeta({
  layout: 'admin'
})
const route = useRoute()
const { updateManual } = useAdminManualsStore()
const { data: manual, pending: loading } = await useCustomLazyFetch<Manual>(
  `/manuals/admin/${+route.params.manualId}`
)
</script>

<style lang="scss" scoped></style>
