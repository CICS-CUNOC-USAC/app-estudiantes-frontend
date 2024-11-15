<template>
  <div class="px-8 py-4">
    <h1 class="text-2xl font-bold">
      Componentes del <span class="italic">Design System</span> (Página
      temporal)
    </h1>

    <div class="my-4">
      <div
        class=" bg-surface-50 p-8 border border-surface-950/45"
      >
        <h2 class="text-2xl font-semibold">Botones</h2>
        <p class="text-primary-emphasis-alt">Botones de la aplicación</p>

        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <CButton
            class="h-min"
            label="Iniciar sesión"
            icon="lucide:log-in"
            icon-pos="left"
          />
          <CButton
            class="h-min"
            severity="danger"
            label="Danger"
            icon="lucide:octagon-alert"
            icon-pos="left"
          />
          <CButton
            class="h-min"
            severity="warn"
            label="Warn"
            icon="lucide:triangle-alert"
            icon-pos="right"
          />
          <CButton
            class="h-min"
            severity="info"
            label="Información"
            icon="lucide:info"
            icon-pos="bottom"
          />
          <CButton
            class="h-min"
            severity="success"
            label="Exito"
            icon="lucide:check"
            icon-pos="top"
          />
          <CButton class="h-min" severity="secondary" label="Secondary" />
          <CButton class="h-min" outlined label="Outlined" />
        </div>
        <h2 class="mt-4 text-2xl font-semibold">Botones cargando</h2>

        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <CButton
            loading
            class="h-min"
            label="Iniciar sesión"
            icon="lucide:log-in"
            icon-pos="left"
          />
          <CButton
            loading
            class="h-min"
            severity="danger"
            label="Danger"
            icon="lucide:octagon-alert"
            icon-pos="left"
          />
          <CButton
            loading
            class="h-min"
            severity="warn"
            label="Warn"
            icon="lucide:triangle-alert"
            icon-pos="right"
          />
          <CButton
            loading
            class="h-min"
            severity="info"
            label="Información"
            icon="lucide:info"
            icon-pos="bottom"
          />
          <CButton
            loading
            class="h-min"
            severity="success"
            label="Exito"
            icon="lucide:check"
            icon-pos="top"
          />
          <CButton
            loading
            class="h-min"
            severity="secondary"
            label="Secondary"
          />
          <CButton loading class="h-min" outlined label="Outlined" />
        </div>

        <h2 class="mt-4 text-2xl font-semibold">Botones desactivados</h2>

        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <CButton
            disabled
            class="h-min"
            label="Desactivado"
            icon="lucide:log-in"
            icon-pos="left"
          />
          <CButton
            disabled
            class="h-min"
            severity="danger"
            label="Desactivado"
            icon="lucide:octagon-alert"
            icon-pos="left"
          />
          <CButton
            disabled
            class="h-min"
            severity="warn"
            label="Desactivado"
            icon="lucide:triangle-alert"
            icon-pos="right"
          />
          <CButton
            disabled
            class="h-min"
            severity="info"
            label="Desactivado"
            icon="lucide:info"
            icon-pos="bottom"
          />
          <CButton
            disabled
            class="h-min"
            severity="success"
            label="Desactivado"
            icon="lucide:check"
            icon-pos="top"
          />
          <CButton
            disabled
            class="h-min"
            severity="secondary"
            label="Desactivado"
          />
          <CButton disabled class="h-min" outlined label="Desactivado" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
</script>
<style lang="postcss" scoped></style>
