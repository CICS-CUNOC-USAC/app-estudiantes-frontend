<template>
  <CCardAlt class="w-full p-8 md:max-w-3xl" no-spacing>
    <template #title>
      <h2 class="pb-4 text-center text-2xl font-semibold">Regístrate</h2>
    </template>
    <template #content>
      <p class="text-center">
        Ingresa tu registro académico y buscaremos tu información en el sistema
        de Registro automáticamente.
      </p>
      <div class="my-3 grid grid-cols-2 gap-4 md:grid-cols-3">
        <CInputText
          v-model="searchValues.ra"
          id="ra"
          label="Registro Académico"
          placeholder="201900000"
          type="number"
          prepend-icon="icon-park-twotone:id-card-h"
          no-borders
        />
        <CInputText
          v-model="searchValues.pin"
          id="pin"
          label="PIN"
          placeholder="*******"
          type="password"
          prepend-icon="icon-park-twotone:id-card-h"
          no-borders
        />
        <CButton
          rounded
          type="submit"
          icon="icon-park-twotone:search"
          label="Consultar"
          @click="execute"
          class="max-md:col-span-2"
          :disabled="!searchValues.ra || !searchValues.pin || loading"
        />
      </div>

      <div
        v-if="status"
        class="mb-2 text-xs font-medium"
        :class="success ? 'text-green-500' : 'text-red-500'"
      >
        {{ status }}
      </div>
      <fieldset
        class="my-4 grid max-h-80 grid-cols-2 gap-x-4 gap-y-3 overflow-visible lg:max-h-none lg:grid-cols-2"
      >
        <CInputText
          name="firstName"
          id="firstName"
          label="Nombre(s)"
          type="text"
          class="col-span-1"
          prepend-icon="icon-park-twotone:people"
          no-borders
          readonly
          :disabled="!success || loading"
          :defaultValue="fakeValues.firstName"
        />
        <CInputText
          name="lastName"
          id="lastName"
          label="Apellido(s)"
          type="text"
          class="col-span-1"
          prepend-icon="icon-park-twotone:people"
          no-borders
          readonly
          :disabled="!success || loading"
          :defaultValue="fakeValues.lastName"
        />

        <CInputText
          name="carrerCode"
          id="carrerCode"
          label="Código de Carrera"
          type="text"
          prepend-icon="icon-park-twotone:id-card-h"
          no-borders
          readonly
          root-class="col-span-2 lg:col-span-1"
          :disabled="!success || loading"
          :defaultValue="`${fakeValues.careerCode} - ${fakeValues.careerName}`"
        />
        <CInputText
          name="email"
          id="email"
          label="Correo institucional"
          type="text"
          prepend-icon="icon-park-twotone:mail"
          no-borders
          readonly
          root-class="col-span-2 lg:col-span-1"
          :disabled="!success || loading"
          :defaultValue="fakeValues.email"
        />
      </fieldset>
      <fieldset
        class="my-2 grid grid-cols-2 gap-2 md:grid-cols-3"
        v-if="success"
      >
        <CInputText
          name="username"
          id="username"
          label="Nombre de usuario"
          prepend-icon="icon-park-twotone:people"
          no-borders
          root-class="col-span-2 md:col-span-1"
        />
        <CInputText
          name="password"
          id="password"
          label="Contraseña"
          type="password"
          prepend-icon="icon-park-twotone:lock"
          no-borders
          root-class="col-span-1 md:col-span-1"
        />
        <CInputText
          name="confirmPassword"
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          prepend-icon="icon-park-twotone:lock"
          no-borders
          root-class="col-span-1 md:col-span-1"
        />
      </fieldset>
      <CButton
        class="mb-3 w-full"
        v-if="success"
        rounded
        icon="icon-park-outline:arrow-right"
        label="Continuar"
      />
    </template>
    <template #footer>
      <div class="flex flex-col gap-y-4">
        <span class="align-center flex gap-2">
          ¿Ya tienes una cuenta?
          <CButton to="/login" variant="link" label="Inicia sesión" />
        </span>
        <div class="align-center flex">
          <CButton
            to="/"
            variant="text"
            icon="icon-park-outline:arrow-left"
            label="Regresar al portal"
          />
        </div>
      </div>
    </template>
  </CCardAlt>
</template>
<script lang="ts" setup>
import CButton from '~/components/primitives/button/CButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { getUserInfoBySirecaCredentials } from '~/lib/api/auth/user'

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: [String, Array],
    default: () => null
  }
})

// start - mocking new sign up flow

const loading = ref(false)
const success = ref(false)
const status = ref('')

const searchValues = ref({
  ra: '',
  pin: ''
})

const fakeValues = {
  firstName: '',
  lastName: '',
  careerCode: '',
  careerName: '',
  email: '',
  username: '',
  password: ''
}

// const { mutate, asyncStatus } = useMutation({
//   mutation: (userCreds: { ra: string; pin: string }) =>
//     getUserInfoBySirecaCredentials(userCreds),
//   onSuccess: () => {
//     console.log('User info fetched successfully')
//   },
//   onError: () => {
//     console.error('Error fetching user info')
//   }
// })
const { execute } = useCustomFetch('/auth/student-info', {
  immediate: false,
  query: searchValues,
  watch: false,
  onRequest: (data) => {
    console.log('Fetching user info...', data.response?._data)
  },
  onResponse: (data) => {
    console.log('Response:', data.response?._data)
  }
})
</script>
<style scoped lang="postcss"></style>
