<template>
  <section>
    <h2 class="font-weight-light">Perfil</h2>
    <h3 class="mb-4 text-overline">Información personal</h3>
    <v-form ref="profileForm" :disabled="loading">
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="profile.first_name"
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
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="profile.last_name"
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
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-text-field
            v-model="user.email"
            label="Correo electrónico"
            type="text"
            :rules="[validationRules.required, ...validationRules.email]"
            required
          >
            <template #prepend>
              <v-icon icon="mdi-email-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-text-field
            v-model="user.ra"
            label="Registro académico"
            type="text"
            disabled
          >
            <template #prepend>
              <v-icon icon="mdi-numeric" size="small" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn min-width="50%" :loading="loading" @click="save">Guardar</v-btn>
      </v-col>
    </v-row>
  </section>
</template>
<script lang="ts">
import { type User } from '~/stores/regular-auth'

export default {
  props: {
    src: {
      type: Object as PropType<User | null>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save'],
  data() {
    return {
      profile: {
        first_name: '',
        last_name: ''
      },
      user: {
        email: '',
        ra: ''
      }
    }
  },
  computed: {
    validationRules() {
      return {
        required: (v: string) => !!v || 'Campo requerido',
        name: [
          (v: string) =>
            (v && v.length <= 100) ||
            'El nombre no debe exceder los 100 caracteres'
        ],
        email: [
          (v: string) =>
            /.+@cunoc\.edu\.gt$/.test(v) || 'E-mail debe ser válido'
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
  watch: {
    src: {
      immediate: true,
      handler(val) {
        this.profile = { ...val.profile }
        this.user = { ...val }
      }
    }
  },
  methods: {
    async save() {
      const form = await this.$refs.profileForm.validate()
      if (!form.valid) return
      const { first_name, last_name } = this.profile
      const { email } = this.user
      const newProfile = {
        first_name,
        last_name,
        user: {
          email
        }
      }
      this.$emit('save', newProfile)
    }
  }
}
</script>
<style lang="scss" scoped></style>
