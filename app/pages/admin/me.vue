<template>
  <div>
    <span> Estoy autenticado: {{ authenticated }} </span>
    <p>
      Mi nombre es:
      <strong>{{ user?.first_name }} {{ user?.last_name }}</strong>
    </p>
    <p>
      Mi email es: <strong>{{ user?.email }}</strong>
    </p>
    <v-btn @click="logout">Salir</v-btn>
  </div>
</template>
<script lang="ts">
import { mapState, mapActions } from 'pinia'
import { useStaffAuthStore } from '~/stores/staff-auth'
import { useAuthStore } from '~/stores/auth'

export default {
  setup() {
    definePageMeta({
      layout: 'dashboard'
    })
  },
  computed: {
    ...mapState(useStaffAuthStore, ['user', 'authenticated'])
  },
  methods: {
    ...mapActions(useStaffAuthStore, ['myProfile']),
    ...mapActions(useAuthStore, ['logout'])
  }
}
</script>
<style lang="scss"></style>
