<template>
  <section class="signup-page">
      <SignupForm
        :loading="loading"
        :error="error"
        @signup="signupUser($event)"
      />
  </section>
</template>
<script setup lang="ts">
import { useRegularAuthStore } from '~/stores/regular-auth'
import SignupForm from '@/components/forms/accounts/SignupForm.vue'

definePageMeta({
  layout: 'empty'
})
useHead({
  title: 'Registro'
})

const { loading, error } = storeToRefs(useRegularAuthStore())

const { signupUser } = useRegularAuthStore()
</script>
<style lang="postcss" scoped>
.signup-page {
  @apply flex min-h-screen w-full items-center justify-center;
  &__form {
    @apply w-full px-3 md:max-w-lg;
  }
}
</style>
