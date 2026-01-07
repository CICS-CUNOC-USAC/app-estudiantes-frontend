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
          @click="getStudentInfo(searchValues)"
          class="max-md:col-span-2"
          :disabled="!searchValues.ra || !searchValues.pin"
          :loading="studentAsyncStatus === 'loading'"
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
        v-if="success"
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
          :defaultValue="studentValues.firstName"
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
          :defaultValue="studentValues.lastName"
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
          :defaultValue="`${studentValues.careerCode} - ${studentValues.careerName}`"
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
          :defaultValue="studentValues.email"
        />
      </fieldset>
      <PForm
        :initial-values
        :resolver
        v-slot="$form"
        @submit="signUpMutation"
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
          :error="$form.username?.error?.message"
        />
        <CInputText
          name="password"
          id="password"
          label="Contraseña"
          type="password"
          prepend-icon="icon-park-twotone:lock"
          no-borders
          root-class="col-span-1 md:col-span-1"
          :error="$form.password?.error?.message"
        />
        <CInputText
          name="confirmPassword"
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          prepend-icon="icon-park-twotone:lock"
          no-borders
          root-class="col-span-1 md:col-span-1"
          :error="$form.confirmPassword?.error?.message"
        />
        <CButton
          class="mb-3 w-full"
          icon="icon-park-outline:arrow-right"
          label="Continuar"
          type="submit"
          :loading="asyncStatus === 'loading'"
        />
      </PForm>
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
import type { FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import CButton from '~/components/primitives/button/CButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { type UserSirecaInfoResponse } from '~/lib/api/auth/user'

const regularAuthStore = useRegularAuthStore()
const { signupUser } = regularAuthStore

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

const initialValues = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const resolver = zodResolver(
  z
    .object({
      username: z
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(20, 'El nombre de usuario no puede tener más de 20 caracteres'),
      password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(20, 'La contraseña no puede tener más de 20 caracteres'),
      confirmPassword: z.string()
    })
    .refine(
      (values) => {
        return values.password === values.confirmPassword
      },
      {
        message: 'Las contraseñas deben coincidir',
        path: ['confirmPassword']
      }
    )
)

const searchValues = ref({
  ra: '',
  pin: ''
})

const studentValues = ref({
  firstName: '',
  lastName: '',
  careerCode: '',
  careerName: '',
  email: '',
  username: '',
  password: ''
})

/*
const { mutate: sirecaInfoMutation, asyncStatus } = useMutation({
  mutation: (userCreds: { ra: string; pin: string }) =>
    getUserInfoBySirecaCredentials(searchValues.value),
  onSuccess: (response) => {
  },
  onError: (error) => {
  }
})
*/

const { mutate: signUpMutation, asyncStatus } = useMutation({
  mutation: (formEvent: FormSubmitEvent) => {
    const { valid, values } = formEvent
    if (!valid) {
      toast.error('Por favor, completa todos los campos correctamente.')
      return Promise.reject('Form is not valid')
    }

    return signupUser({
      first_name: studentValues.value.firstName,
      last_name: studentValues.value.lastName,
      user: {
        email: studentValues.value.email,
        career_code: Number(studentValues.value.careerCode.slice(-2)),
        ra: searchValues.value.ra,
        username: values.username,
        password: values.password
      }
    })
  },
  onSuccess: (response) => {},
  onError: (error) => {}
})

const { mutate: getStudentInfo, asyncStatus: studentAsyncStatus } = useMutation(
  {
    mutation: (credentials: { ra: string; pin: string }) =>
      $api<UserSirecaInfoResponse>('/auth/student-info', {
        method: 'GET',
        query: credentials
      }),
    onError: (error) => {
      status.value = error.data?.message
        ? `No hemos podido obtener tu información: ${error.data?.message}`
        : 'No se ha podido consultar SIRECA, por favor intenta más tarde'
      // toast.error('Error al Consultar', {
      //   description:
      //     error.data?.message ??
      //     'No se ha podido consultar SIRECA, por favor intenta más tarde'
      // })
      success.value = false
    },
    onSuccess: (response) => {
      const studentData = response.estudiante
      const careerData = response.inscrito
      studentValues.value.firstName = studentData.nombres
      studentValues.value.lastName = studentData.apellidos
      studentValues.value.email = studentData.correo
      studentValues.value.careerCode = careerData.codigo
      studentValues.value.careerName = careerData.carrera

      toast.success('Información obtenida exitosamente')
      status.value = 'Información obtenida exitosamente.'
      success.value = true
    }
  }
)

// const { execute } = useCustomFetch<UserSirecaInfoResponse>(
//   '/auth/student-info',
//   {
//     immediate: false,
//     query: searchValues,
//     watch: false,
//     onRequest: (data) => {
//       console.log('Fetching user info...', data.response?._data)
//     },
//     onResponse: (response) => {
//       const studentData = response.response._data.estudiante
//       const careerData = response.response._data.inscrito
//       studentValues.value.firstName = studentData.nombres
//       studentValues.value.lastName = studentData.apellidos
//       studentValues.value.email = studentData.correo
//       studentValues.value.careerCode = careerData.codigo
//       studentValues.value.careerName = careerData.carrera

//       toast.success('Informacion obtenida exitosamente')
//       success.value = true
//     },
//     onResponseError: (error) => {
//       toast.error('Error al Consultar', {
//         description:
//           error.response ??
//           'No se ha podido consultar SIRECA, por favor intenta mas tarde'
//       })
//     }
//   }
// )
</script>
<style scoped lang="postcss"></style>
