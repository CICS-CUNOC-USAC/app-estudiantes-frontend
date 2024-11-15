<template>
  <div class="space-y-5 px-8 py-4">
    <h1 class="text-2xl font-bold">
      Componentes del <span class="italic">Design System</span> (Página
      temporal)
    </h1>

    <div
      class="border border-surface-950/45 bg-surface-50 p-8 dark:bg-neutral-700"
    >
      <h2 class="text-2xl font-semibold">Botones</h2>
      <p class="text-primary-emphasis-alt">Botones de la aplicación</p>

      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
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

      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
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
        <CButton loading class="h-min" severity="secondary" label="Secondary" />
        <CButton loading class="h-min" outlined label="Outlined" />
      </div>

      <h2 class="mt-4 text-2xl font-semibold">Botones desactivados</h2>

      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
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

    <div
      class="border border-surface-950/45 bg-surface-50 p-8 dark:bg-neutral-700"
    >
    <h2 class="mt-4 text-2xl font-semibold">Tarjetas</h2>
      <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CCardAlt
          title="Titulo"
          description="Tarjeta por defecto"
          small="Texto pequeño"
        />
        <CCardAlt
          title="Titulo"
          description="Tarjeta elevada no interactiva"
          small="Texto pequeño"
          elevated
        />
        <CCardAlt
          title="Titulo"
          description="Tarjeta interactiva"
          small="Texto pequeño"
          interactive
        />
        <CCardAlt
          title="Titulo"
          description="Tarjeta habilitada con link"
          small="Texto pequeño"
          interactive
          to="/design"
        />
        <CCardAlt
          title="Titulo"
          small="Texto pequeño"
          interactive
          to="/design"
        >
      <template #content>
        <div class="space-y-4">
          <p>
            Tarjeta con contenido personalizado
          </p>
          <img
          src="https://cataas.com/cat"
          alt="Placeholder"
          class="w-full h-48 object-cover rounded-lg"
          />
          <code class="block text-xs text-gray-500">
            <span class="text-white bg-slate-800 py-1.5 px-2">$ npm install cat</span>
          </code>
          <span class="block pb-4 text-xs tracking-tight text-gray-500">
            <Icon name="lucide:calendar-clock" class="mr-1 inline-block !text-sm" />
            12/12/2021
          </span>
        </div>
      </template>
      </CCardAlt>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
</script>
<style lang="postcss" scoped></style>
