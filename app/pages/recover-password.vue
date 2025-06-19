<template>
  <section class="flex min-h-screen w-full items-center justify-center">
    <div class="w-full px-3 md:max-w-lg">
      <PasswordRecoveryForm
        :loading="asyncStatus === 'loading'"
        :admin="false"
        :show-signup="true"
        @recover="mutate"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { toast } from 'vue-sonner'
import PasswordRecoveryForm from '~/components/forms/accounts/PasswordRecoveryForm.vue'
import { FetchError } from 'ofetch'
import { requestPasswordRecovery } from '~/lib/api/auth/main'

const { mutate, asyncStatus } = useMutation({
  // mutation: (email: string) => requestPasswordRecovery({ email }),
  mutation: (email: string) => {
    return requestPasswordRecovery({ email })
  },
  onSuccess: () => {
    toast.success('Correo de recuperación enviado', {
      description:
        'Hemos enviado un correo con instrucciones para recuperar tu contraseña'
    })
  },
  onError: (error) => {
    if (error instanceof FetchError)
      error.statusCode === 404
        ? toast.error('Correo no encontrado', {
            description: 'No hemos encontrado una cuenta con este correo, por favor verifica que sea correcto'
          })
        : toast.error('Ha ocurrido un error inesperado')
  }
})

definePageMeta({
  layout: 'empty'
})
useCustomPageTitle('Recuperar contraseña')
</script>
