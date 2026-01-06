<template>
  <section class="login-page">
    <div class="form">
      <LoginForm
        :loading="asyncStatus === 'loading'"
        :admin="false"
        :show-signup="true"
        @login="mutate"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { type FetchError } from 'ofetch'
import { toast } from 'vue-sonner'
import LoginForm from '~/components/forms/accounts/LoginForm.vue'
import { useRegularAuthStore } from '~/stores/regular-auth'

const regularAuthStore = useRegularAuthStore()
const { loginUser } = regularAuthStore

const { mutate, asyncStatus } = useMutation({
  mutation: (credentials: { email: string; password: string }) => {
    return loginUser(credentials)
  },
  onError: (error: FetchError) => {
    if (error.data && error.statusCode === 401) {
      toast.error('Las credenciales parecen ser incorrectas, por favor intenta de nuevo')
    } else {
      toast.error('Ha ocurrido un error inesperado, por favor intente de nuevo más tarde')
    }
  },
  onSuccess: (data) => {
    toast.success(`Bienvenid@ ${data.data.value.user.profile.first_name} ${data.data.value.user.profile.last_name}`)
  }
})

definePageMeta({
  layout: 'empty'
})
useHead({
  title: 'Iniciar sesión'
})
</script>
<style scoped>
@reference '~/assets/css/main.css';

.login-page {
  @apply flex min-h-screen w-full items-center justify-center;
  .form {
    @apply w-full px-3 md:max-w-lg;
  }
}
</style>
