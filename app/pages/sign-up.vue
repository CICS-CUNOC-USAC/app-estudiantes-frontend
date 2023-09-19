<template>
  <section class="login-page">
    <v-row justify="center" no-gutters>
      <v-col cols="11" sm="8" md="8" lg="4" xl="4">
        <SignupForm
          :loading="loading"
          :error="error"
          @signup="signUp($event)"
        />
      </v-col>
    </v-row>
  </section>
</template>
<script lang="ts">
import { mapState, mapActions } from 'pinia'
import { useRegularAuthStore, SignupPayload } from '~/stores/regular-auth'
import SignupForm from '@/components/forms/accounts/SignupForm.vue'
export default {
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
