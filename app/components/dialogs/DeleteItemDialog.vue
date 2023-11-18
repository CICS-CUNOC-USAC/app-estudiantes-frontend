<template>
  <div>
    <slot :open="() => (dialog = true)">
      <v-btn color="primary" @click="dialog = true"> Open Dialog </v-btn>
    </slot>
    <v-dialog v-model="dialog" max-width="300px">
      <v-card class="pa-3">
        <v-card-title> ¿Eliminar este elemento? </v-card-title>
        <v-card-text> Esta acción no se puede deshacer. </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            prepend-icon="mdi-cancel"
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn
            color="red"
            prepend-icon="mdi-delete-outline"
            @click="confirmAction"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['confirm'])
const dialog = ref(false)
const confirmAction = () => {
  dialog.value = false
  emit('confirm')
}
</script>
