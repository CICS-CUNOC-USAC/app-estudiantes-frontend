<template>
  <div>
    <span> Estoy autenticado: {{ authenticated }} </span>
    <p>
      Mi nombre es:
      <strong
        >{{ user?.profile.first_name }} {{ user?.profile.last_name }}</strong
      >
    </p>
    <p>
      Mi email es: <strong>{{ user?.email }}</strong>
    </p>
    <p>
      Mi registro academico es: <strong>{{ user?.ra }}</strong>
    </p>
    <v-btn @click="logout">Salir</v-btn>
  </div>
</template>
<script lang="ts">
import { mapState, mapActions } from 'pinia'
import { useRegularAuthStore } from '../../stores/regular-auth'
import { useAuthStore } from '~/stores/auth'

export default {
  setup() {
    definePageMeta({
      layout: 'dashboard'
    })
  },
  computed: {
    ...mapState(useRegularAuthStore, ['user', 'authenticated'])
  },
  methods: {
    ...mapActions(useRegularAuthStore, ['myProfile']),
    ...mapActions(useAuthStore, ['logout'])
  }
}
</script>
<style lang="scss"></style>
