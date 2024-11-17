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
<script lang="ts">
import { mapState, mapActions } from 'pinia'
import { useRegularAuthStore } from '~/stores/regular-auth'
import LoginForm from '~/components/forms/accounts/LoginForm.vue'
export default {
  components: {
    LoginForm
  },
  setup() {
    definePageMeta({
      layout: 'empty'
    })
    useHead({
      title: 'Iniciar sesión'
    })
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(useRegularAuthStore, ['loading', 'error'])
  },
  methods: {
    login(credentials: { email: string; password: string }) {
      this.loginUser(credentials)
    },
    ...mapActions(useRegularAuthStore, ['loginUser'])
  }
}
</script>
<style lang="postcss" scoped>
.login-page {
  @apply w-full min-h-screen flex justify-center items-center;
  &__form {
    @apply w-full px-3 md:max-w-lg;
  }
}
</style>
