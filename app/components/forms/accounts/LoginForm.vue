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
            <v-icon :icon="emailIcon" size="small" />
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
            :color="admin ? 'red' : 'accent-4'"
            @click="login"
          >
            Iniciar sesión
          </v-btn>
        </v-col>
        <v-col v-if="showSignup" cols="12">
          <span class="d-flex align-center">
            ¿No tienes una cuenta?
            <v-btn to="/sign-up" class="ml-1" variant="plain" :ripple="false">
              <strong>Regístrate</strong>
            </v-btn>
          </span>
        </v-col>
        <v-col cols="12">
          <span>
            <v-btn
              to="/"
              class="px-0"
              variant="plain"
              :ripple="false"
              prepend-icon="mdi-arrow-left"
            >
              <strong>Regresar al portal</strong>
            </v-btn>
          </span>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts" setup>
const { admin } = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  showSignup: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['login'])

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const emailIcon = computed(() => {
  return admin ? 'mdi-shield-crown-outline' : 'mdi-email-outline'
})

const login = () => {
  const newCredentials = {
    email: email.value.toLowerCase().replace(/\s/g, '').trim(),
    password: password.value
  }
  emit('login', newCredentials)
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
  &--admin {
    &:hover {
      color: #ff6e40 !important;
    }
    &:active {
      color: #bf360c !important;
    }
  }
}
</style>
