<template>
  <div class="space-y-5 lg:px-8 lg:py-4">
    <h1 class="text-2xl font-bold">
      Componentes del <span class="italic">Design System</span> (Página
      temporal)
    </h1>

    <div
      class="border border-surface-950/45 bg-surface-50 lg:p-8 p-4 dark:bg-neutral-700 rounded"
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

      <h2 class="text-2xl font-semibold">Variantes</h2>
      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <CButton
          class="h-min"
          label="Continuar"
          variant="text"
          icon="lucide:log-in"
          icon-pos="left"
        />
        <CButton
          class="h-min"
          severity="danger"
          label="Danger"
          variant="text"
          icon="lucide:octagon-alert"
          icon-pos="left"
        />
        <CButton
          class="h-min"
          severity="warn"
          variant="text"
          label="Warn"
          icon="lucide:triangle-alert"
          icon-pos="right"
        />
        <CButton
          class="h-min"
          severity="info"
          label="Información Link"
          variant="link"
          icon="lucide:info"
        />
        <CButton
          class="h-min"
          severity="success"
          variant="link"
          label="Exito Link"
          icon="lucide:check"
          icon-pos="right"
        />
        <CButton class="h-min" variant="text" severity="secondary" label="Secondary" />
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
      class="border border-surface-950/45 bg-surface-50 lg:p-8 p-4 dark:bg-neutral-700 rounded"
    >
      <h2 class="mt-4 text-2xl font-semibold">Tarjetas</h2>
      <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CCardAlt
          title="Titulo"
          description="Tarjeta por defecto"
          small="Texto pequeño"
          ><template #footer>
            <span
              class="flex items-center gap-x-2 self-end text-sm font-semibold"
              >Ver más
              <Icon
                name="lucide:arrow-right"
                class="inline-block duration-300 ease-in-out"
              />
            </span> </template
        ></CCardAlt>
        <CCardAlt
          title="Titulo"
          description="Tarjeta elevada no interactiva"
          small="Texto pequeño"
          elevated
          ><template #footer>
            <span
              class="flex items-center gap-x-2 self-end text-sm font-semibold"
              >Ver más
              <Icon
                name="lucide:arrow-right"
                class="inline-block duration-300 ease-in-out"
              />
            </span> </template
        ></CCardAlt>
        <CCardAlt
          title="Titulo"
          description="Tarjeta interactiva"
          small="Texto pequeño"
          interactive
          ><template #footer>
            <span
              class="flex items-center gap-x-2 self-end text-sm font-semibold"
              >Ver más
              <Icon
                name="lucide:arrow-right"
                class="inline-block duration-300 ease-in-out"
              />
            </span> </template
        ></CCardAlt>
        <CCardAlt
          title="Titulo"
          description="Tarjeta habilitada con link"
          small="Texto pequeño"
          interactive
          to="/design"
          ><template #footer>
            <span
              class="flex items-center gap-x-2 self-end text-sm font-semibold"
              >Ver más
              <Icon
                name="lucide:arrow-right"
                class="inline-block duration-300 ease-in-out"
              />
            </span> </template
        ></CCardAlt>
        <CCardAlt
          title="Titulo"
          small="Texto pequeño"
          interactive
          class="lg:col-span-2"
        >
          <template #content>
            <div class="space-y-4">
              <p>Tarjeta con contenido personalizado</p>
              <img
                src="https://cataas.com/cat"
                alt="Placeholder"
                class="h-48 w-full rounded-lg object-cover"
              />
              <code class="block text-xs text-gray-500">
                <span class="bg-slate-800 px-2 py-1.5 text-white"
                  >$ npm install cat</span
                >
              </code>
              <span class="block pb-4 text-xs tracking-tight text-gray-500">
                <Icon
                  name="lucide:calendar-clock"
                  class="mr-1 inline-block !text-sm"
                />
                12/12/2021
              </span>
            </div>
          </template>
          <template #footer>
            <div class="flex items-center gap-x-2 self-end">
              <CButton
                label="Ver más"
                icon="lucide:arrow-right"
                variant="text"
                class="flex-1 text-xs"
              />
              <CButton
                label="No me interesa"
                icon="lucide:circle-x"
                variant="text"
                class="flex-1 text-xs"
              />
            </div>
          </template>
        </CCardAlt>
        <CCardAlt
          title="Titulo"
          small="Texto pequeño"
          class="lg:col-span-2"
        >
          <template #content>
            <div class="space-y-4">
              <p>Tarjeta con contenido personalizado</p>
              <img
                src="https://cataas.com/cat"
                alt="Placeholder"
                class="h-48 w-full rounded-lg object-cover"
              />
              <code class="block text-xs text-gray-500">
                <span class="bg-slate-800 px-2 py-1.5 text-white"
                  >$ npm install cat</span
                >
              </code>
              <span class="block pb-4 text-xs tracking-tight text-gray-500">
                <Icon
                  name="lucide:calendar-clock"
                  class="mr-1 inline-block !text-sm"
                />
                12/12/2021
              </span>
            </div>
          </template>
          <template #footer>
            <div class="flex items-center gap-x-2 self-end">
              <CButton
              label="No me interesa"
              outlined
              icon="lucide:circle-x"
              class="flex-1 text-xs"
              />
              <CButton
                label="Ver más"
                icon="lucide:arrow-right"
                class="flex-1 text-xs h-full"
              />
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
