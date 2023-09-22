<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      type="list-item-two-line"
    ></v-skeleton-loader>
    <section v-else>
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
      <v-btn to="/dashboard/profile/edit">Editar</v-btn>
    </section>
  </div>
</template>
<script lang="ts">
import { mapState, mapActions, Pinia } from 'pinia'
import { useRegularAuthStore } from '~/stores/regular-auth'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtComponent({
  asyncData({ $pinia }: { $pinia: Pinia }) {
    const store = useRegularAuthStore($pinia)
    store.myProfile()
    return {}
  },
  setup() {
    definePageMeta({
      layout: 'dashboard'
    })
  },
  computed: {
    ...mapState(useRegularAuthStore, ['user', 'authenticated', 'loading'])
  },
  methods: {
    ...mapActions(useRegularAuthStore, ['myProfile']),
    ...mapActions(useAuthStore, ['logout'])
  }
})
</script>
<style lang="scss"></style>
