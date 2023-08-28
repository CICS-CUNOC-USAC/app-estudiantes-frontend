<template>
  <v-card class="login-card pa-8">
    <v-card-title>
      <h3 class="text-center mb-4">Iniciar sesión</h3>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="email"
          label="Correo electrónico"
          type="email"
          required
          :disabled="loading"
        >
          <template #prepend>
            <v-icon icon="mdi-email-outline" size="small" />
          </template>
        </v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="
            showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          required
          :disabled="loading"
          @click:append="showPassword = !showPassword"
        >
          <template #prepend>
            <v-icon icon="mdi-dots-horizontal" size="small" />
          </template>
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="12">
          <v-btn variant="tonal" width="100%" :loading="loading" @click="login">
            Iniciar sesión
          </v-btn>
        </v-col>
        <v-col cols="12">
          <span>
            ¿No tienes una cuenta?
            <NuxtLink to="/signup"
              ><strong class="text-orange-darken-4 text-decoration-underline"
                >Regístrate</strong
              ></NuxtLink
            >
          </span>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script setup>
const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const login = () => {
  loading.value = true
  // simulate login with a timeout
  setTimeout(() => {
    loading.value = false
    router.push('/')
  }, 1000)
}
</script>
<style lang="scss" scoped>
.login-card {
  // outline: 1px solid #212121;
}
</style>
