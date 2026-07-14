<template>
  <section class="signup-page">
    <div class="form">
      <SignupForm
        :loading="loading"
        :error="error"
        @signup="signupUser($event)"
      />
    </div>
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
<style>
@reference '~/assets/css/main.css';

.signup-page {
  @apply flex min-h-screen w-full items-center justify-center py-10;
  .form {
    @apply w-full px-3 md:max-w-2xl;
  }
}
</style>
