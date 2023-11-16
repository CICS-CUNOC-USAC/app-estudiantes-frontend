<template>
  <div>
    <slot :open="() => (dialog = true)">
      <v-btn color="primary" @click="dialog = true"> Nuevo elemento </v-btn>
    </slot>
    <v-dialog v-model="dialog" max-width="48rem">
      <v-card class="pa-3">
        <v-card-title>
          <v-icon class="mr-2"> mdi-book-plus-outline </v-icon>
          <span class="font-weight-bold">Crear nuevo libro</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="libraryForm">
            <v-row>
              <v-col cols="12"
                ><v-text-field
                  v-model="item.name"
                  :rules="[required, length]"
                  label="Nombre"
                  placeholder="Nombre del libro ej. Termoquímica 2"
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
                  placeholder="Descripción del libro"
                  variant="outlined"
                  required
                  no-resize
                  rows="4"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.author"
                  :rules="[required, length]"
                  label="Autor"
                  placeholder="Autor del libro ej. John Doe"
                  variant="outlined"
                  required
                  no-resize
                  rows="4"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.source_url"
                  :rules="[required, length]"
                  label="Enlace de origen"
                  placeholder="Enlace de origen del libro"
                  variant="outlined"
                  required
                  no-resize
                  rows="4"
                ></v-text-field>
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
const dialog = ref(false)
const emit = defineEmits<{
  newItem: [item: BookPayload]
}>()
const libraryForm = ref()
const close = async () => {
  await libraryForm.value.reset()
  dialog.value = false
}
const item = ref({
  name: '',
  description: '',
  author: '',
  source_url: '',
  file: undefined
})
const handleSubmit = async () => {
  const { valid } = await libraryForm.value.validate()
  if (!valid) return
  emit('newItem', { ...item.value })
  close()
}
</script>
<style lang="scss" scoped></style>
