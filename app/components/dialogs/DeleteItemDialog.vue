<template>
  <CDialog v-model:open="dialog">
    <CDialogTrigger as-child>
      <slot />
    </CDialogTrigger>
    <CDialogContent title="¿Eliminar este elemento?">
      <p>Esta acción no es reversible</p>
      <div class="flex gap-x-4 mt-4">

        <DialogClose as-child>

          <CButton
          label="Cancelar"
          severity="secondary"
          @click="dialog = false"
          icon="icon-park-outline:close"
          class="w-full"
          />
        </DialogClose>
        <CButton
        label="Eliminar"
        severity="danger"
        @click="confirmAction"
        
        icon="icon-park-twotone:delete"
        class="w-full"
        />
      </div>

    </CDialogContent>
  </CDialog>
</template>

<script setup lang="ts">
import CButton from '../primitives/button/CButton.vue';
import { CDialog, CDialogContent, CDialogTrigger } from '../primitives/dialog'

const emit = defineEmits(['confirm'])
const dialog = ref(false)
const confirmAction = () => {
  dialog.value = false
  emit('confirm')
}
</script>
