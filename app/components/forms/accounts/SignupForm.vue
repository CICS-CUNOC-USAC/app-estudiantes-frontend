<template>
  <v-card class="signup-card pa-8">
    <v-card-title>
      <h3 class="text-center mb-4">Regístrate</h3>
    </v-card-title>
    <v-card-text>
      <v-form
        id="signup-form"
        ref="form"
        :disabled="loading"
        @submit.prevent="signup"
      >
        <v-text-field
          v-model="firstName"
          label="Nombre(s)"
          type="text"
          :rules="[validationRules.required, ...validationRules.name]"
          pattern="[a-zA-Z]{100}"
          required
        >
          <template #prepend>
            <v-icon icon="mdi-account-outline" size="small" />
          </template>
        </v-text-field>
        <v-text-field
          v-model="lastName"
          label="Apellido(s)"
          type="text"
          :rules="[validationRules.required, ...validationRules.name]"
          pattern="[a-zA-Z]{100}"
          required
        >
          <template #prepend>
            <v-icon icon="mdi-account-outline" size="small" />
          </template>
        </v-text-field>
        <v-text-field
          v-model="ra"
          label="Registro Académico"
          type="text"
          :rules="[validationRules.required, ...validationRules.ra]"
          pattern="[0-9]{9}"
          required
        >
          <template #prepend>
            <v-icon icon="mdi-numeric" size="small" />
          </template>
        </v-text-field>
        <v-autocomplete
          v-model="careerCode"
          :items="careerItems"
          item-value="value"
          item-title="text"
          label="Carrera"
          :rules="[validationRules.required]"
          required
        >
          <template #prepend>
            <v-icon icon="mdi-numeric" size="small" />
          </template>
        </v-autocomplete>
        <v-text-field
          v-model="email"
          label="Correo electrónico"
          :rules="[validationRules.required, ...validationRules.email]"
          type="text"
          required
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
          :rules="[validationRules.required, ...validationRules.password]"
          required
          @click:append="showPassword = !showPassword"
        >
          <template #prepend>
            <v-icon icon="mdi-dots-horizontal" size="small" />
          </template>
        </v-text-field>
        <v-text-field
          v-model="confirmPassword"
          :append-icon="
            showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          label="Confirmar contraseña"
          :type="showPassword ? 'text' : 'password'"
          :rules="[validationRules.required, ...confirmPasswordRules]"
          required
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
        <v-col v-if="error && !Array.isArray(error)" cols="12">
          <span class="text-red d-flex align-center">
            <v-icon class="mr-3"> mdi-alert-circle-outline </v-icon>
            <span class="font-weight-medium text-body-2">{{ error }}</span>
          </span>
        </v-col>
        <v-col v-if="Array.isArray(error)" cols="12">
          <span class="text-red">
            <v-icon class="mr-3 mb-2"> mdi-alert-circle-outline </v-icon>
            <div
              v-for="e in error"
              :key="e as string"
              class="font-weight-medium text-body-2"
            >
              {{ e }}
            </div>
          </span>
        </v-col>
        <v-col cols="12">
          <v-btn
            type="submit"
            form="signup-form"
            variant="tonal"
            width="100%"
            :loading="loading"
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
<script lang="ts">
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: [String, Array],
      default: () => null
    }
  },
  emits: ['signup'],
  data() {
    return {
      careerItems: [
        {
          text: 'Ingeniería Civil',
          value: 33
        },
        {
          text: 'Ingeniería Mécánica',
          value: 34
        },
        {
          text: 'Ingeniería Industrial',
          value: 35
        },
        {
          text: 'Ingeniería Mécanica Industrial',
          value: 36
        },
        {
          text: 'Ingeniería en Ciencias y Sistemas',
          value: 58
        }
      ],
      firstName: '',
      lastName: '',
      ra: '',
      careerCode: null,
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      validationRules: {
        required: (v: string) => !!v || 'Campo requerido',
        name: [
          (v: string) =>
            (v && v.length <= 100) ||
            'El nombre no debe exceder los 100 caracteres'
        ],
        email: [
          (v: string) =>
            /.+@cunoc\.edu\.gt$/.test(v) ||
            'E-mail debe ser válido e institucional'
        ],
        ra: [
          (v: string) =>
            (v && v.length === 9) || 'El RA debe tener 9 caracteres',
          (v: string) => /[0-9]{9}/.test(v) || 'El RA debe ser numérico'
        ],
        password: [
          (v: string) =>
            (v && v.length >= 8) ||
            'La contraseña debe tener al menos 8 caracteres'
        ]
      }
    }
  },
  computed: {
    confirmPasswordRules() {
      return [
        (v: string) => v === this.password || 'Las contraseñas no coinciden'
      ]
    }
  },
  methods: {
    async signup() {
      const formRef = await this.$refs.form.validate()
      if (formRef.valid) {
        const payload = {
          firstName: this.firstName,
          lastName: this.lastName,
          ra: this.ra,
          career_code: this.careerCode,
          email: this.email,
          password: this.password
        }
        this.$emit('signup', payload)
      }
    }
  }
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
