<template>
  <div>
    <h3 class="my-2 text-lg font-semibold">Información personal</h3>
    <form class="mb-6 mt-2" @submit.prevent="save">
      <fieldset class="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
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
      </fieldset>
      <CButton
        type="submit"
        label="Guardar"
        :disabled="loading"
        class="mt-4"
        icon="lucide:check"
      />
    </form>
  </div>
</template>
<script lang="ts" setup>
import type { VForm } from 'vuetify/components'
import { type User } from '~/stores/regular-auth'
import CInputText from '../primitives/form/CInputText.vue'
import CButton from '../primitives/button/CButton.vue';

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
    console.log(val)
    profile.value = { ...val?.profile }
    user.value = { ...val }
  },
  { deep: true, immediate: true }
)

const save = async () => {
  // const form = await profileForm.value?.validate()
  // if (!form?.valid) return
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

