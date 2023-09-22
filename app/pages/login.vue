<template>
  <section class="login-page">
    <v-row justify="center" no-gutters>
      <v-col cols="11" sm="8" md="8" lg="5" xl="4">
        <LoginForm
          :loading="loading"
          :error="error"
          :admin="false"
          :show-signup="true"
          @login="login($event)"
        />
      </v-col>
    </v-row>
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
<style lang="scss" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
