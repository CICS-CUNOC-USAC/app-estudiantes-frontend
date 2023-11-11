<template>
  <div>
    <slot :open="() => (dialog = true)">
      <v-btn color="primary" @click="dialog = true"> Nuevo elemento </v-btn>
    </slot>
    <v-dialog v-model="dialog" max-width="48rem">
      <v-card class="pa-3">
        <v-card-title>
          <v-icon class="mr-2"> mdi-book-plus-outline </v-icon>
          <span class="font-weight-bold">Crear nuevo manual</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="manualForm">
            <v-row>
              <v-col cols="12"
                ><v-text-field
                  v-model="item.name"
                  :rules="[required, length]"
                  label="Nombre"
                  required
                  variant="outlined"
                  counter="250"
                ></v-text-field
              ></v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="item.description"
                  :rules="[required]"
                  label="Descripción"
                  variant="outlined"
                  required
                  no-resize
                  rows="4"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="item.file"
                  :rules="[requiredFile, pdfFormat]"
                  label="Manual en formato PDF"
                  :multiple="false"
                  accept="application/pdf"
                  variant="outlined"
                  clearable
                ></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn prepend-icon="mdi-cancel" @click="close"> Cancelar </v-btn>
          <v-spacer />
          <v-btn
            color="green"
            prepend-icon="mdi-content-save-outline"
            @click="handleSubmit"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const { required, requiredFile, pdfFormat, length } = useFormValidators()
const emit = defineEmits<{
  newItem: [item: object]
}>()
const dialog = ref(false)
const manualForm = ref()
const item = ref<ManualPayload>({
  name: '',
  description: '',
  file: undefined
})

const close = async () => {
  await manualForm.value.reset()
  dialog.value = false
}

const handleSubmit = async () => {
  const { valid } = await manualForm.value.validate()
  if (!valid) return
  emit('newItem', { ...item.value })
  close()
}
</script>
