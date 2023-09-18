<template>
  <section class="login-page">
    <v-row justify="center" no-gutters>
      <v-col cols="11" sm="8" md="8" lg="4" xl="4">
        <SignupForm />
      </v-col>
    </v-row>
  </section>
</template>
<script>
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
      title: 'Iniciar sesión'
    })
  },
  data() {
    return {
      email: '',
      password: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => v.length >= 8 || 'Password must be at least 8 characters'
      ]
    }
  },
  methods: {
    signUp() {
      console.log('sign up')
      // this.$router.push('/dashboard')
    }
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
