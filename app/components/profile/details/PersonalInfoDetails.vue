<template>
  <section>
    <div>
      <h2 class="font-weight-light">Perfil</h2>
      <h3 class="mb-4 text-overline">Información personal</h3>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="profile.first_name"
            readonly
            variant="solo"
            label="Nombre(s)"
          >
            <template #prepend>
              <v-icon icon="mdi-account-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="profile.last_name"
            readonly
            variant="solo"
            label="Apellido(s)"
          >
            <template #prepend>
              <v-icon icon="mdi-account-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-text-field
            v-model="user.email"
            readonly
            variant="solo"
            label="Correo electrónico"
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
            readonly
            variant="solo"
          >
            <template #prepend>
              <v-icon icon="mdi-numeric" size="small" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </div>
    <div class="mt-2">
      <h2 class="font-weight-light">Académico</h2>
      <h3 class="mb-4 text-overline">Información de carrera</h3>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="user.career.name"
            readonly
            variant="solo"
            label="Carrera"
          >
            <template #prepend>
              <v-icon icon="mdi-school-outline" size="small" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="user.career.code"
            readonly
            variant="solo"
            label="Código de carrera"
          >
            <template #prepend>
              <v-icon icon="mdi-pound" size="small" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </div>
  </section>
</template>
<script lang="ts">
import { PropType } from 'nuxt/dist/app/compat/capi'
import { User } from '~/stores/regular-auth'

export default {
  props: {
    src: {
      type: Object as PropType<User | null>,
      required: true
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
        ra: '',
        career: {
          code: '',
          name: ''
        }
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
  }
}
</script>
