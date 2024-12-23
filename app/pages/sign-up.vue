<template>
  <section class="signup-page">
    <div class="signup-page__form">
        <SignupForm
          :loading="loading"
          :error="error"
          @signup="signUp($event)"
        />
    </div>
  </section>
</template>
<script lang="ts">
import { mapState, mapActions, type Pinia } from 'pinia'
import { useRegularAuthStore, type SignupPayload } from '~/stores/regular-auth'
import SignupForm from '@/components/forms/accounts/SignupForm.vue'
export default defineNuxtComponent({
  asyncData({ $pinia }: { $pinia: Pinia }) {
    const store = useRegularAuthStore($pinia)
    store.clearError()
    return {}
  },
  components: {
    SignupForm
  },
  setup() {
    definePageMeta({
      layout: 'empty'
    })
    useHead({
      title: 'Registro'
    })
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(useRegularAuthStore, ['loading', 'error'])
  },
  methods: {
    signUp(payload: SignupPayload) {
      this.signupUser(payload)
    },
    ...mapActions(useRegularAuthStore, ['signupUser'])
  }
})
</script>
<style lang="postcss" scoped>
.signup-page {
  @apply w-full min-h-screen flex justify-center items-center;
  &__form {
    @apply w-full px-3 md:max-w-lg;
  }
}
</style>

