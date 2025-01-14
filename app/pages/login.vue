<template>
  <section class="login-page">
    <div class="login-page__form">
      <LoginForm
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
import { mapState, mapActions } from 'pinia'
import { useRegularAuthStore } from '~/stores/regular-auth'
import LoginForm from '~/components/forms/accounts/LoginForm.vue'

const regularAuthStore = useRegularAuthStore()
const {loading, error} = storeToRefs(regularAuthStore)
const { loginUser } = regularAuthStore

const login = (credentials: { email: string; password: string }) => {
  loginUser(credentials)
}

definePageMeta({
  layout: 'empty'
})
useHead({
  title: 'Iniciar sesión'
})
</script>
<style lang="postcss" scoped>
.login-page {
  @apply w-full min-h-screen flex justify-center items-center;
  &__form {
    @apply w-full px-3 md:max-w-lg;
  }
}
</style>
