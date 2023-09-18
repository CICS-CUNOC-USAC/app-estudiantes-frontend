<template>
  <v-card class="signup-card pa-8">
    <v-card-title>
      <h3 class="text-center mb-4">Regístrate</h3>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="ra"
          label="Registro Académico"
          type="text"
          pattern="[0-9]{8}"
          required
          :disabled="loading"
        >
          <template #prepend>
            <v-icon icon="mdi-numeric" size="small" />
          </template>
        </v-text-field>
        <v-text-field
          v-model="email"
          label="Correo electrónico"
          type="email"
          required
          :disabled="loading"
        >
          <template #prepend>
            <v-icon icon="mdi-email-open-outline" size="small" />
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
          <v-btn
            variant="tonal"
            width="100%"
            :loading="loading"
            class="sbutton"
            @click="login"
          >
            Continuar
          </v-btn>
        </v-col>
        <v-col cols="12">
          <span>
            ¿Ya tienes una cuenta?
            <NuxtLink
              to="/login"
              class="text-orange-darken-3 text-decoration-none nav-link ml-1"
              ><strong>Inicia sesión</strong></NuxtLink
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
const ra = ref('')
const loading = ref(false)

const login = () => {
  loading.value = true
  // simulate login with a timeout
  setTimeout(() => {
    router.push('/')
    loading.value = false
  }, 2000)
}
</script>
<style scoped lang="scss">
.nav-link {
  &:hover {
    color: #fb8c00 !important;
  }
  &:active {
    color: #bf360c !important;
  }
}
</style>
