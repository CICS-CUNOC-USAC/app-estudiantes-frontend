<template>
  <main>
    <nav class="space-x-4">
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="mb-5 text-muted-color-emphasis lg:mb-2"
        to="/"
      />
    </nav>
    <h1 class="text-xl font-semibold">
      <Icon
        name="icon-park-twotone:setting-two"
        class="mb-1 mr-1.5 inline-block"
      />
      Configuración de la aplicación
    </h1>

    <div class="space-y-6 my-6">
      <section>
        <h2 class="mb-2 inline-flex items-center gap-2 text-lg font-semibold">
          <Icon name="icon-park-twotone:color-filter" />
          Tema
        </h2>
        <p>
          Elije un tema general para la apariencia de la aplicación. Puedes
          seleccionar entre colores y claros y oscuros.
        </p>
          <CSelect
            class="w-1/4 my-2"
            :model-value="theme"
            :items="options"
            checkmark
            @value-change="handleThemeChange"
          />
      </section>
    </div>
  </main>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
import CSelect from '~/components/primitives/form/CSelect.vue';
import { allThemesPrimaries } from '~/themes/pThemes'

const configsStore = useConfigsStore()
const { theme } = storeToRefs(configsStore)
const { changeTheme: handleThemeChange } = configsStore

const options = allThemesPrimaries.map((theme) => theme.name)
</script>
<style lang="postcss" scoped></style>
