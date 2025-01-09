<template>
  <div>
    <h3 class="my-2 text-lg font-semibold">Información personal</h3>
    <section class="mb-6 mt-2 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
      <CInputText
        v-model="profile.first_name"
        label="Nombre(s)"
        
        no-borders
        prepend-icon="icon-park-twotone:people"
      />
      <CInputText
        v-model="profile.last_name"
        label="Apellido(s)"
        
        no-borders
        prepend-icon="icon-park-twotone:people"
      />

      <CInputText
        v-model="user.email"
        label="Correo electrónico"
        disabled
        no-borders
        prepend-icon="icon-park-twotone:mail"
      />
      <CInputText
        v-model="user.ra"
        label="Registro académico"
        disabled
        no-borders
        prepend-icon="icon-park-twotone:id-card-h"
      />
    </section>
    <!-- <h2 class="font-weight-light">Perfil</h2>
    <h3 class="mb-4 text-overline">Información personal</h3>
    <v-form ref="profileForm" :disabled="loading">
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="profile.first_name"
            label="Nombre(s)"
            type="text"
            :rules="[validationRules.required, ...validationRules.name]"
            pattern="[a-zA-Z]{100}"
            required
          >
            <template #prepend>
              <v-icon icon="mdi-account-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="profile.last_name"
            label="Apellido(s)"
            type="text"
            :rules="[validationRules.required, ...validationRules.name]"
            pattern="[a-zA-Z]{100}"
            required
          >
            <template #prepend>
              <v-icon icon="mdi-account-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-text-field
            v-model="user.email"
            label="Correo electrónico"
            type="text"
            :rules="[validationRules.required, ...validationRules.email]"
            required
          >
            <template #prepend>
              <v-icon icon="mdi-email-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-text-field
            v-model="user.ra"
            label="Registro académico"
            type="text"
            disabled
          >
            <template #prepend>
              <v-icon icon="mdi-numeric" size="small" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn min-width="50%" :loading="loading" @click="save">Guardar</v-btn>
      </v-col>
    </v-row> -->
  </div>
</template>
<script lang="ts" setup>
import type { VForm } from 'vuetify/components'
import { type User } from '~/stores/regular-auth'
import CInputText from '../primitives/form/CInputText.vue';

const props = defineProps<{
  src: User | null
  loading: boolean
}>()

const emit = defineEmits(['save'])

const profile = ref({
  first_name: '',
  last_name: ''
})

const user = ref({
  email: '',
  ra: ''
})

watch(
  () => props.src,
  (val) => {
    profile.value = { ...val?.profile }
    user.value = { ...val }
  }
)

const validationRules = computed(() => ({
  required: (v: string) => !!v || 'Campo requerido',
  name: [
    (v: string) =>
      (v && v.length <= 100) || 'El nombre no debe exceder los 100 caracteres'
  ],
  email: [
    (v: string) => /.+@cunoc\.edu\.gt$/.test(v) || 'E-mail debe ser válido'
  ],
  ra: [
    (v: string) => (v && v.length === 9) || 'El RA debe tener 9 caracteres',
    (v: string) => /[0-9]{9}/.test(v) || 'El RA debe ser numérico'
  ],
  password: [
    (v: string) =>
      (v && v.length >= 8) || 'La contraseña debe tener al menos 8 caracteres'
  ]
}))
const profileForm = ref<VForm | null>(null)
const save = async () => {
  const form = await profileForm.value?.validate()
  if (!form?.valid) return
  const { first_name, last_name } = unref(profile)
  const { email } = unref(user)
  const newProfile = {
    first_name,
    last_name,
    user: {
      email
    }
  }
  emit('save', newProfile)
}
</script>
<style lang="scss" scoped></style>
