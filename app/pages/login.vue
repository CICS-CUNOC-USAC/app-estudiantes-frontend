<template>
  <section>
    <v-form>
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        :rules="emailRules"
        required
      />
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        :rules="passwordRules"
        required
      />
      <v-btn
        @click="login"
      >
        Iniciar sesión
      </v-btn>
    </v-form>
  </section>
</template>
<script>
export default {
  setup () {
    definePageMeta({
      layout: 'login'
    })
  },
  data () {
    return {
      email: '',
      password: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password must be at least 8 characters'
      ]
    }
  },
  methods: {
    login
    () {
      console.log('login')
      // this.$router.push('/dashboard')
    }
  }
}
</script>
<style lang="">

</style>
