<template>
  <v-form ref="form">
    <v-row v-if="value">
      <v-col cols="12">
        <v-text-field
          v-model="value.first_name"
          label="Nombre"
          variant="outlined"
          dense
          :rules="[
            (v) => !!v || 'El nombre es requerido',
            (v) =>
              (v && v.length <= 100) ||
              'El apellido debe tener menos de 20 caracteres'
          ]"
        >
          <template #prepend>
            <v-icon icon="mdi-account-outline" size="small" />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="value.last_name"
          label="Apellido"
          variant="outlined"
          dense
          :rules="[
            (v) => !!v || 'El apellido es requerido',
            (v) =>
              (v && v.length <= 100) ||
              'El apellido debe tener menos de 20 caracteres'
          ]"
        >
          <template #prepend>
            <v-icon icon="mdi-account-outline" size="small" />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="value.email"
          label="Correo electrónico"
          variant="outlined"
          dense
          :rules="[
            (v) => !!v || 'El correo electrónico es requerido',
            (v) => /.+@.+/.test(v) || 'El correo electrónico debe ser válido',
            (v) =>
              (v && v.length <= 320) || 'El correo electrónico es muy largo'
          ]"
        >
          <template #prepend>
            <v-icon icon="mdi-email-open-outline" size="small" />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="value.password"
          :append-icon="
            showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          :rules="passwordRules"
          @click:append="showPassword = !showPassword"
        >
          <template #prepend>
            <v-icon icon="mdi-dots-horizontal" size="small" />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="primary"
          prepend-icon="mdi-content-save-outline"
          @click="handleSubmit"
        >
          {{ props.update ? 'Actualizar' : 'Crear' }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
<script setup lang="ts">
const props = defineProps<{
  update?: boolean
  modelValue?: {
    id: number
    first_name: string
    last_name: string
    email: string
    password: string
  }
}>()
const passwordRules = computed(() => {
  if (props.update) {
    // If the user is updating, the password is not required but if inputted, it must be at least 8 characters long
    return [
      (v: string) => {
        if (v)
          return (
            v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres'
          )
        return !v
      }
    ]
  } else {
    // If the user is creating, the password is required and must be at least 8 characters long
    return [
      (v) => !!v || 'La contraseña es requerida',
      (v) =>
        (v && v.length >= 8) || 'La contraseña debe tener al menos 8 caracteres'
    ]
  }
})
const showPassword = ref(false)
const emit = defineEmits(['update:modelValue', 'saveStaff'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const form = ref()
const resetForm = () => {
  form.value.reset()
}
const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return
  emit('update:modelValue', value.value)
  emit('saveStaff')
}
defineExpose({
  resetForm
})
</script>
<style lang="scss" scoped></style>
