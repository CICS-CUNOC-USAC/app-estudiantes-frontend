<template>
  <section class="signup-page px-2">
      <SignupForm
      class="form"
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
<style>
@reference '~/assets/css/main.css';

.signup-page {
  @apply flex min-h-screen w-full items-center justify-center;
  .form {
    /* @apply w-full md:max-w-3xl; */
  }
}
</style>
