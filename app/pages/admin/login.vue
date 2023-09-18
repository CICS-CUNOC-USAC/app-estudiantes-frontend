<template>
  <section class="login-page">
    <v-row justify="center" no-gutters>
      <v-col cols="11" sm="8" md="8" lg="5" xl="5">
        <LoginForm
          :loading="loading"
          :error="error"
          admin
          :show-signup="false"
          @login="login($event)"
        />
      </v-col>
    </v-row>
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
    ...mapState(useStaffAuthStore, ['loading', 'error'])
  },
  methods: {
    login(credentials: { email: string; password: string }) {
      this.loginStaff(credentials)
    },
    ...mapActions(useStaffAuthStore, ['loginStaff'])
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
~/stores/staff-auth
