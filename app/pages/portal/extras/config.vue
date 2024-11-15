<template>
  <main>
    <header class="mb-4">
      <h1>Configuración</h1>
      <CButton icon="lucide:arrow-left" to="/" label="Regresar" />
      <CButton icon="lucide:palette" to="/design" label="Ir a design" />
    </header>
    <section>
      <h2 class="mb-2 inline-flex gap-2">
        <Icon name="lucide:palette" class="" />
        Tema
      </h2>
      <p>
        Elije un tema general para la apariencia de la aplicación. Puedes
        seleccionar entre colores y claros y oscuros.
      </p>
      <PButton label="Test" unstyled/>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <PSelect v-model="selectedTheme" :options checkmark :highlightOnSelect="false" @value-change="handleThemeChange" />
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue';
import { allThemesPrimaries } from '~/themes/pThemes';
import { updatePrimaryPalette } from '@primevue/themes';

const pv = usePrimeVue();
const selectedTheme = ref(pv.config.theme.preset.name)

const options = allThemesPrimaries.map((theme) => theme.name)

const handleThemeChange = (newTheme: string) => {
  const selectedTheme = allThemesPrimaries.find((theme) => theme.name === newTheme)
  selectedTheme && updatePrimaryPalette(selectedTheme.values)
  pv.config.theme.preset.name = newTheme
}

</script>
<style lang="postcss" scoped></style>
