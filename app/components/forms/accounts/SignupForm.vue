<template>
  <CCardAlt class="min-w-max p-8" no-spacing>
    <template #title>
      <h2 class="pb-4 text-center text-2xl font-semibold">Regístrate</h2>
    </template>
    <template #content>
      <PForm
        :initial-values
        :resolver
        v-slot="$form"
        @submit="signup"
        class="mb-4 bg-transparent"
      >
        <!-- {{ $form }} -->
        <fieldset
          class="my-4 grid max-h-80 p-1.5  grid-cols-1 gap-x-4 gap-y-3 overflow-y-auto lg:max-h-none lg:grid-cols-2 "
        >
          <CInputText
            name="firstName"
            id="firstName"
            label="Nombre(s)"
            placeholder="Juan"
            type="text"
            prepend-icon="icon-park-twotone:people"
            no-borders
            :error="$form.firstName?.error?.message"
          />
          <CInputText
            name="lastName"
            id="lastName"
            label="Apellido(s)"
            placeholder="Pérez"
            type="text"
            prepend-icon="icon-park-twotone:people"
            no-borders
            :error="$form.lastName?.error?.message"
          />
          <CInputText
            name="ra"
            id="ra"
            label="Registro Académico"
            placeholder="201900000"
            type="text"
            prepend-icon="icon-park-twotone:id-card-h"
            no-borders
            :error="$form.ra?.error?.message"
          />
          <CSelect
            name="careerCode"
            id="careerCode"
            :items="careerItems"
            checkmark
            placeholder="Selecciona una carrera"
            clearable
            label="Carrera"
            prepend-icon="icon-park-twotone:bachelor-cap-one"
            no-borders
            option-label="text"
            option-value="value"
            :error="$form.careerCode?.error?.message"
          />

          <CInputText
            name="email"
            id="email"
            label="Correo electrónico"
            placeholder="nombre@cunoc.edu.gt"
            type="text"
            prepend-icon="icon-park-twotone:mail"
            no-borders
            :error="$form.email?.error?.message"
          />
          <CInputText
            name="password"
            id="password"
            :class="{
              'font-mono': showPassword
            }"
            label="Contraseña"
            placeholder="********"
            prepend-icon="icon-park-twotone:lock"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            :append-icon="
              showPassword
                ? 'icon-park-outline:preview-close'
                : 'icon-park-twotone:preview-open'
            "
            no-borders
            :error="$form.password?.error?.message"
          />
          <CInputText
            name="confirmPassword"
            id="confirmPassword"
            prepend-icon="icon-park-twotone:lock"
            :class="{
              'font-mono': showPassword
            }"
            label="Confirmar contraseña"
            placeholder="********"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            :append-icon="
              showPassword
                ? 'icon-park-outline:preview-close'
                : 'icon-park-twotone:preview-open'
            "
            no-borders
            :error="$form.confirmPassword?.error?.message"
          />
        </fieldset>
        <CButton
          class="w-full"
          :loading="loading"
          rounded
          type="submit"
          label="Registrarse"
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
import { z } from 'zod'
import CButton from '~/components/primitives/button/CButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'

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

// start - refactor with primevue forms

const initialValues = reactive({
  firstName: '',
  lastName: '',
  ra: '',
  careerCode: null,
  email: '',
  password: '',
  confirmPassword: ''
})

const resolver = zodResolver(
  z
    .object({
      firstName: z
        .string()
        .nonempty({
          message: 'Nombre requerido'
        })
        .max(100),
      lastName: z
        .string()
        .nonempty({
          message: 'Apellido requerido'
        })
        .max(100),
      ra: z
        .string({ message: 'Registro Académico requerido' })
        .length(9, { message: 'Registro Académico debe tener 9 dígitos' })
        .regex(/[0-9]{9}/, {
          message: 'Registro Académico debe contener solo dígitos'
        }),
      careerCode: z.number({
        message: 'Carrera requerida'
      }),

      email: z
        .string()
        .email({
          message: 'E-mail debe ser válido e institucional'
        })
        .regex(/.+@cunoc\.edu\.gt$/, {
          message: 'E-mail debe ser válido e institucional'
        }),
      password: z
        .string()
        .min(8, {
          message: 'La contraseña debe tener al menos 8 caracteres'
        })
        .max(100, {
          message: 'La contraseña no debe exceder los 100 caracteres'
        }),
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
    .transform((values) => {
      return {
        first_name: values.firstName,
        last_name: values.lastName,
        user: {
          email: values.email,
          career_code: Number(values.careerCode),
          ra: values.ra,
          password: values.password
        }
      }
    })
)

// end - refactor with primevue forms

const emit = defineEmits(['signup'])
const careerItems = [
  {
    text: 'Ingeniería Civil',
    value: 33
  },
  {
    text: 'Ingeniería Mécánica',
    value: 34
  },
  {
    text: 'Ingeniería Industrial',
    value: 35
  },
  {
    text: 'Ingeniería Mécanica Industrial',
    value: 36
  },
  {
    text: 'Ingeniería en Ciencias y Sistemas',
    value: 58
  }
]

const showPassword = ref(false)

const signup = (e: FormSubmitEvent) => {
  if (e.valid) {
    emit('signup', e.values)
  }
}
</script>
<style scoped lang="postcss">
</style>
