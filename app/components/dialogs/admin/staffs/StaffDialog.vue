<template>
  <div>
    <slot :open="() => (dialog = true)">
      <v-btn color="primary" @click="dialog = true"> Acción de Admin </v-btn>
    </slot>
    <v-dialog v-model="dialog" max-width="40rem">
      <v-card class="pa-3">
        <v-card-title>
          <v-icon class="mr-2"> mdi-shield-edit-outline </v-icon>
          <span class="font-weight-bold">
            {{ props.update ? 'Editar' : 'Crear' }} usuario administrativo
          </span>
        </v-card-title>
        <v-card-text>
          <StaffForm
            ref="staffForm"
            v-model="staffData"
            :update="props.update"
            @save-staff="saveStaff"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import StaffForm from '~/components/forms/admin/staffs/StaffForm.vue'
const emit = defineEmits<{
  saveStaff: [staffPayload: StaffPayload]
}>()
const props = defineProps<{
  update?: boolean
  userItem?: Staff
}>()
const staffData = reactive({
  id: 0,
  first_name: '',
  last_name: '',
  email: '',
  password: ''
})
const staffForm = ref()
watch(
  () => props.userItem,
  () => {
    if (props.userItem) {
      staffData.id = props.userItem.id
      staffData.first_name = props.userItem.first_name
      staffData.last_name = props.userItem.last_name
      staffData.email = props.userItem.email
    }
  },
  { immediate: true, deep: true }
)
const saveStaff = () => {
  emit('saveStaff', { ...staffData })
  close()
}
const dialog = ref(false)
const close = () => {
  staffForm.value.resetForm()
  dialog.value = false
}
</script>
<style lang="scss" scoped></style>
