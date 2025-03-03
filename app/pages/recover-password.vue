<template>
  <section class="w-full min-h-screen flex justify-center items-center">
    <div class="w-full px-3 md:max-w-lg">
      <PasswordRecoveryForm
        :loading="loading"
        :error="error"
        :admin="false"
        :show-signup="true"
        @login="login($event)"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import PasswordRecoveryForm from '~/components/forms/accounts/PasswordRecoveryForm.vue'
import { useRegularAuthStore } from '~/stores/regular-auth'

const regularAuthStore = useRegularAuthStore()
const {loading, error} = storeToRefs(regularAuthStore)
const { loginUser } = regularAuthStore

const login = (credentials: { email: string; password: string }) => {
  loginUser(credentials)
}

definePageMeta({
  layout: 'empty'
})
useCustomPageTitle('Recuperar contraseña')
</script>