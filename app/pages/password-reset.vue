<template>
  <section class="flex min-h-screen w-full items-center justify-center">
    <div class="w-full px-3 md:max-w-lg">
      <Card class="gap-4 px-4 py-8">
        <CardHeader>
          <CardTitle class="text-lg">Cambiar contraseña</CardTitle>
          <CardDescription>
            Escribe tu nueva contraseña para continuar
          </CardDescription>
        </CardHeader>

        <CardContent>
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
            <Button
              class="w-full"
              :loading="asyncStatus === 'loading'"
              type="submit"
              icon="icon-park-outline:arrow-right"
              rounded
              label="Continuar"
            />
          </PForm>
        </CardContent>
        <CardFooter class="flex flex-col gap-y-4">
          <div class="flex flex-col gap-y-4">
            <div class="align-center flex">
              <Button
                to="/login"
                variant="text"
                icon="icon-park-outline:arrow-left"
                label="Regresar a inicio de sesión"
              />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  </section>
</template>
<script lang="ts" setup>
import type { FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { FetchError } from 'ofetch'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import CInputText from '~/components/primitives/form/CInputText.vue'
import Button from '~/components/ui/button/Button.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { resetPassword } from '~/lib/api/auth/main'

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
