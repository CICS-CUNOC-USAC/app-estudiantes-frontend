<template>
  <main>
    <h1 class="mb-4">Editar manual</h1>
    <v-skeleton-loader v-if="loading" type="heading, paragraph, actions" />
    <div v-if="manual && !loading">
      <v-row>
        <v-col cols="12" sm="4">
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
            :rows="2"
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
        <v-col cols="12">
          <v-row>
            <v-col cols="6" md="3">
              <v-checkbox-btn
                v-model="enableManualEdit"
                label="Actualizar archivo de manual?"
              ></v-checkbox-btn>
            </v-col>
            <v-col v-if="enableManualEdit" cols="6">
              <v-form ref="manualFileForm">
                <v-file-input
                  v-model="file"
                  accept="application/pdf"
                  :multiple="false"
                  label="Archivo PDF"
                  :rules="[requiredFile, pdfFormat]"
                  variant="underlined"
                  density="comfortable"
                ></v-file-input>
              </v-form>
            </v-col>
            <v-col v-if="enableManualEdit" cols="12" md="3" align-self="center">
              <v-btn
                prepend-icon="mdi-upload-outline"
                color="black"
                variant="tonal"
                block
                @click="updateManualFile"
              >
                Subir
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="!enableManualEdit" cols="12">
          <div v-if="manual.media">
            <h3 class="mb-4">Previsualización del manual</h3>

            <ClientOnly class="d-flex justify-center">
              <PdfPreview :pdf-url="manual.media.url" />
              <template #fallback>
                <v-progress-circular indeterminate :size="50" :width="6" />
                <p class="font-weight-light">Cargando...</p>
              </template>
            </ClientOnly>
          </div>
        </v-col>
      </v-row>
    </div>
    <ElementNotFound
      v-if="!manual && !loading"
      element-type="manual"
      back-to-route="/admin/manuals"
      back-to-label="Volver a la lista de manuales"
    />
  </main>
</template>
<script lang="ts" setup>
import ElementNotFound from '@/components/partials/ElementNotFound.vue'
import PdfPreview from '~/components/content/PdfPreview.vue'
definePageMeta({
  layout: 'admin'
})
const route = useRoute()
const { requiredFile, pdfFormat } = useFormValidators()
const enableManualEdit = ref(false)
const { updateManual, fetchManualById } = useAdminManualsStore()
const { updateMedia } = useMediaStore()
const {
  data: manual,
  pending: loading,
  error,
  refresh
} = await useLazyAsyncData('edit-manual', () =>
  fetchManualById(+route.params.manualId)
)
const file = ref(undefined)
const manualFileForm = ref()

const saveManual = (_payload: ManualPayload) => {
  if (manual.value) {
    const { name, description } = manual.value
    updateManual(+route.params.manualId, { name, description })
    refresh()
  }
}

const updateManualFile = async () => {
  const { valid } = await manualFileForm.value.validate()
  if (!valid) return
  if (file.value && manual.value?.media?.id) {
    loading.value = true
    await updateMedia(file.value[0]!, manual.value.media.id)
    loading.value = false
    await refresh()
  }
  enableManualEdit.value = false
}
</script>
