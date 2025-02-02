<template>
  <section class="login-page">
    <div class="form">
      <LoginForm
        :loading="loading"
        admin
        :show-signup="false"
        @login="login($event)"
      />
    </div>
  </section>
</template>
<script lang="ts">
import { mapState, mapActions } from 'pinia'
import { useStaffAuthStore } from '~/stores/staff-auth'
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
    ...mapState(useStaffAuthStore, ['loading'])
  },
  methods: {
    async login(credentials: { email: string; password: string }) {
      await this.loginStaff(credentials)
    },
    ...mapActions(useStaffAuthStore, ['loginStaff'])
  }
}
</script>
<style scoped>
@reference '~/assets/css/main.css';

.login-page {
  @apply w-full min-h-screen flex justify-center items-center;
  .form {
    @apply w-full px-3 md:max-w-lg;
  }
}
</style>
