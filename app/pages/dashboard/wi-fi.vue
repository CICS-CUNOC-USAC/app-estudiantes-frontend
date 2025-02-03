<template>
  <main>
    <header class="mb-4">
      <h1>Acceso Wi-Fi</h1>
      <p>
        En esta sección podrás solicitar y manejar tu acceso a la red Wi-Fi
        disponible en el Salón 1, del modulo de Ingenieria. Recuerda que este
        servicio solo está disponible para la carrera de Ingeniería en Ciencias
        y Sistemas.
      </p>
    </header>
    <section class="main-wifi-section">
      <template v-if="data?.status === WifiAccessStatus.INACTIVE">
        Acceso inactivo
      </template>
    </section>
    <VOtpInput :model-value="12321" />
  </main>
</template>
<script setup lang="ts">
import { WifiAccessStatus, type WifiAccess } from '~/utils/types/wifi-access'

const { data } = await useLazyAsyncData<WifiAccess>(() => $api('/wifi-access'))

definePageMeta({
  layout: 'dashboard'
})
</script>

