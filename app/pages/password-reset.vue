<template>
  <section class="flex min-h-screen w-full items-center justify-center">
    <div class="w-full px-3 md:max-w-lg">
      <CCardAlt class="px-8 py-12">
        <template #title>
          <h2 class="pb-4 text-center text-2xl font-semibold">
            Cambiar contraseña
          </h2>
        </template>
        <template #content>
          <p class="text-center">Escribe tu nueva contraseña para continuar</p>
          <PForm
            class="flex flex-col gap-y-4 py-4"
            @submit="handleSubmit"
            :initial-values
            :resolver
            v-slot="$form"

          >
            <CInputText
              name="password"
              label="Nueva contraseña"
              placeholder="********"
              prepend-icon="icon-park-twotone:lock"
              no-borders
              clear-button
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :append-icon="
                showPassword
                  ? 'icon-park-outline:preview-close'
                  : 'icon-park-twotone:preview-open'
              "
              :error="$form.password?.error?.message"
            />
            <CInputText
              name="confirmPassword"
              label="Confirmar contraseña"
              placeholder="********"
              prepend-icon="icon-park-twotone:lock"
              no-borders
              clear-button
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :append-icon="
                showPassword
                  ? 'icon-park-outline:preview-close'
                  : 'icon-park-twotone:preview-open'
              "
              :error="$form.confirmPassword?.error?.message"
            />
            <CButton
              class="w-full"
              :loading="asyncStatus === 'loading'"
              type="submit"
              icon="icon-park-outline:arrow-right"
              rounded
              label="Continuar"
            />
          </PForm>
        </template>
        <template #footer>
          <div class="flex flex-col gap-y-4">
            <div class="align-center flex">
              <CButton
                to="/login"
                variant="text"
                icon="icon-park-outline:arrow-left"
                label="Regresar a inicio de sesión"
              />
            </div>
          </div>
        </template>
      </CCardAlt>
    </div>
  </section>
</template>
<script lang="ts" setup>
import type { FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import CButton from '~/components/primitives/button/CButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { resetPassword } from '~/lib/api/auth/main'
import { FetchError } from 'ofetch'

const route = useRoute()
if (!route.query.tkn) {
  navigateTo('/recover-password')
}
const showPassword = ref(false)

const initialValues = reactive({
  password: '',
  confirmPassword: ''
})

const resolver = zodResolver(
  z
    .object({
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
)

const { mutate, asyncStatus } = useMutation({
  mutation: (data: { password: string }) => {
    return resetPassword({
      password: data.password,
      token: route.query.tkn as string
    })
  },
  onSuccess: () => {
    toast.success('Contraseña actualizada', {
      description:
        'Tu contraseña ha sido actualizada, ahora puedes iniciar sesión'
    })
    navigateTo('/login')
  },
  onError: (error) => {
    if (error instanceof FetchError)
      error.statusCode === 400
        ? toast.error('Enlace inválido', {
            description:
              'Parece que este enlace ha expirado o es inválido, intenta recuperar tu contraseña nuevamente'
          })
        : toast.error('Ha ocurrido un error inesperado')
  }
})

const handleSubmit = async (e: FormSubmitEvent) => {
  if (e.valid) {
    console.log(e.values)
    mutate({
      password: e.values.password
    })
  }
}

definePageMeta({
  layout: 'empty'
})
useCustomPageTitle('Recuperar contraseña')
</script>
