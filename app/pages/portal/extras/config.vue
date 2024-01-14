<template>
  <main>
    <header class="mb-4">
      <h1>Configuración</h1>
      <v-btn prepend-icon="mdi-arrow-left" class="mt-3" @click="router.back">
        Regresar al inicio
      </v-btn>
    </header>
    <section>
      <h2 class="font-weight-light mb-2">
        <v-icon class="mr-1 text-accent-3">mdi-palette-outline</v-icon>
        Tema
      </h2>
      <p>
        Elije un tema general para la apariencia de la aplicación. Puedes
        seleccionar entre colores y claros y oscuros.
      </p>
      <v-row>
        <v-col cols="12" sm="8" lg="4">
          <v-select
            :model-value="theme"
            class="my-6"
            variant="outlined"
            :items="themeItems"
            @update:model-value="handleThemeChange"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props" :color="item.raw.previewFg">
                <template #prepend>
                  <v-avatar
                    variant="flat"
                    :color="item.raw.previewBg"
                    class="mr-2"
                    density="compact"
                  >
                    <v-icon :color="item.raw.previewFg">mdi-circle</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </section>
  </main>
</template>
<script setup lang="ts">
import { useTheme } from 'vuetify/lib/framework.mjs'

const { changeTheme } = useConfigsStore()
const { theme } = storeToRefs(useConfigsStore())

const router = useRouter()
const vTheme = useTheme()
const themes = vTheme.computedThemes.value
const themeNames = computed(() => Object.keys(themes))

themeNames.value.splice(themeNames.value.indexOf('light'), 1)
themeNames.value.splice(themeNames.value.indexOf('dark'), 1)

const themeItems = themeNames.value.map((name) => {
  const previewBg = themes[name].dark ? '#424242' : '#E0E0E0'
  const previewFg = themes[name].colors['preview-foreground']
  const words = name.split(/(?=[A-Z])/)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  const label = words.join(' ')
  return { title: label, value: name, previewBg, previewFg }
})

const handleThemeChange = (newTheme: string) => {
  const globalScheme = vTheme.computedThemes.value[newTheme].dark
    ? 'dark'
    : 'light'
  vTheme.global.name.value = globalScheme
  changeTheme(newTheme)
}
</script>
<style lang="scss" scoped></style>
