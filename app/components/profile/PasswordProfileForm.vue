<template>
  <section>
    <h2 class="font-weight-light">Seguridad</h2>
    <h3 class="mb-2 text-overline">Contraseña</h3>
    <v-form ref="passForm" :disabled="loading" class="mb-6">
      <v-row>
        <v-col cols="12" sm="12" md="6" lg="6" xl="6">
          <v-text-field
            v-model="password"
            label="Nueva contraseña"
            :type="showPassword ? 'text' : 'password'"
            :rules="[...validationRules.password]"
            required
            placeholder="********"
            :append-icon="
              showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
            "
            @click:append="showPassword = !showPassword"
          >
            <template #prepend>
              <v-icon icon="mdi-dots-horizontal" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6" lg="6" xl="6">
          <v-text-field
            v-model="confirmPassword"
            label="Confirmar nueva contraseña"
            :type="showPassword ? 'text' : 'password'"
            :rules="[...validationRules.confirmPassword]"
            required
            placeholder="********"
            :append-icon="
              showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
            "
            @click:append="showPassword = !showPassword"
          >
            <template #prepend>
              <v-icon icon="mdi-dots-horizontal" size="small" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn min-width="50%" :loading="loading" @click="savePassword"
          >Cambiar</v-btn
        >
      </v-col>
    </v-row>
  </section>
</template>
<script lang="ts">
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['savePassword'],
  data() {
    return {
      password: '',
      confirmPassword: '',
      showPassword: false
    }
  },
  computed: {
    validationRules() {
      return {
        password: [
          (v: string) =>
            (v && v.length >= 8) ||
            'La contraseña debe tener al menos 8 caracteres'
        ],
        confirmPassword: [
          (v: string) =>
            (v && v === this.password) || 'Las contraseñas no coinciden'
        ]
      }
    }
  },
  methods: {
    async savePassword() {
      const form = await this.$refs.passForm.validate()
      if (!form.valid) return
      this.$emit('savePassword', { user: { password: this.password } })
    }
  }
}
</script>
<style lang="scss" scoped></style>
