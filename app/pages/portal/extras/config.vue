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

    <div class="my-6 space-y-6">
      <section>
        <h2 class="mb-2 inline-flex items-center gap-2 text-lg font-semibold">
          <Icon name="icon-park-twotone:color-filter" />
          Tema
        </h2>
        <p>
          Elije un tema general para la apariencia de la aplicación. Puedes
          seleccionar entre colores y claros y oscuros.
        </p>

        <h3 class="mt-4 inline-flex items-center gap-2 text-sm font-medium">
          Esquema de color
        </h3>

        <ColorScheme placeholder="..." tag="div">
          <ToggleGroupRoot
            class="flex items-center gap-2.5 py-2.5"
            :model-value="$colorMode.preference"
            @update:model-value="
              (val) => {
                if (val) $colorMode.preference = val as string
              }
            "
          >
            <ToggleGroupItem
              v-for="(option, index) in schemeOptions"
              class="group flex items-center gap-2 rounded-lg border-2 border-transparent px-2 py-1 transition duration-[50ms] hover:bg-primary/10 active:bg-primary/15 data-[state=on]:border-black data-[state=on]:bg-primary-600 data-[state=on]:text-white dark:data-[state=on]:border-white"
              :value="option.value"
            >
              <Icon :name="option.icon" :class="option.iconClass" />
              <span class="text-sm">{{ option.name }}</span>
            </ToggleGroupItem>
          </ToggleGroupRoot>
        </ColorScheme>
        <h3 class="inline-flex items-center gap-2 text-sm font-medium">
          Color de acento
        </h3>
        <CSelect
          class="my-2 lg:w-1/4"
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
import CSelect from '~/components/primitives/form/CSelect.vue'
import { allThemesPrimaries } from '~/themes/pThemes'

const schemeOptions = [
  {
    name: 'Sistema',
    value: 'system',
    icon: 'icon-park-twotone:computer',
    iconClass:
      'scale-[80%] group-data-[state=on]:scale-100 transition-transform duration-500'
  },
  {
    name: 'Claro',
    value: 'light',
    icon: 'icon-park-twotone:sun',
    iconClass:
      'scale-[80%] translate-y-0.5 group-data-[state=on]:rotate-45 group-data-[state=on]:translate-y-0 group-data-[state=on]:scale-100  transition-transform duration-500'
  },
  {
    name: 'Oscuro',
    value: 'dark',
    icon: 'icon-park-twotone:moon',
    iconClass:
      'scale-[80%] -rotate-12 translate-y-0.5 group-data-[state=on]:rotate-0 group-data-[state=on]:translate-y-0 group-data-[state=on]:scale-100  transition-transform duration-500'
  }
]

const configsStore = useConfigsStore()
const { theme } = storeToRefs(configsStore)
const { changeTheme: handleThemeChange } = configsStore

const options = allThemesPrimaries.map((theme) => theme.name)
</script>
<style lang="postcss" scoped></style>
