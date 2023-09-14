<template>
  <section class="login-page">
    <v-row justify="center" no-gutters>
      <v-col cols="11" sm="8" md="8" lg="4" xl="4">
        <LoginForm />
      </v-col>
    </v-row>
  </section>
</template>
<script>
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
    // Testing custom fetch composable
    const data = useApiFetch('/auth/login', {
      method
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
    login() {
      console.log('login')
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
