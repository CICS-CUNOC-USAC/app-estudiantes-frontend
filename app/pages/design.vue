<template>
  <div class="space-y-5 pb-56 lg:px-8 lg:pt-4">
    <h1 class="text-2xl font-bold">
      Componentes del <span class="italic">Design System</span> (Página
      temporal)
    </h1>

    <div
      class="border-surface-950/45 bg-surface-50 rounded border p-4 lg:p-8 dark:bg-neutral-700"
    >
      <h2 class="text-2xl font-semibold">Botones</h2>
      <p class="text-primary-emphasis-alt">Botones de la aplicación</p>

      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Button
          class="h-min"
          label="Iniciar sesión"
          icon="lucide:log-in"
          icon-pos="left"
        />
        <Button
          class="h-min"
          severity="danger"
          label="Danger"
          icon="lucide:octagon-alert"
          icon-pos="left"
        />
        <Button
          class="h-min"
          severity="warn"
          label="Warn"
          icon="lucide:triangle-alert"
          icon-pos="right"
        />
        <Button
          class="h-min"
          severity="info"
          label="Información"
          icon="lucide:info"
          icon-pos="bottom"
        />
        <Button
          class="h-min"
          severity="success"
          label="Exito"
          icon="lucide:check"
          icon-pos="top"
        />
        <Button class="h-min" severity="secondary" label="Secondary" />
        <Button class="h-min" outlined label="Outlined" />
      </div>

      <h2 class="text-2xl font-semibold">Variantes</h2>
      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Button
          class="h-min"
          label="Continuar"
          variant="text"
          icon="lucide:log-in"
          icon-pos="left"
        />
        <Button
          class="h-min"
          severity="danger"
          label="Danger"
          variant="text"
          icon="lucide:octagon-alert"
          icon-pos="left"
        />
        <Button
          class="h-min"
          severity="warn"
          variant="text"
          label="Warn"
          icon="lucide:triangle-alert"
          icon-pos="right"
        />
        <Button
          class="h-min"
          severity="info"
          label="Información Link"
          variant="link"
          icon="lucide:info"
        />
        <Button
          class="h-min"
          severity="success"
          variant="link"
          label="Exito Link"
          icon="lucide:check"
          icon-pos="right"
        />
        <Button
          class="h-min"
          variant="text"
          severity="secondary"
          label="Secondary"
        />
        <Button class="h-min" outlined label="Outlined" />
      </div>

      <h2 class="mt-4 text-2xl font-semibold">Variante Tonal</h2>
      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Button
          class="h-min"
          variant="tonal"
          label="Tonal"
          icon="lucide:log-in"
        />
        <Button
          class="h-min"
          variant="tonal"
          severity="danger"
          label="Danger"
          icon="lucide:octagon-alert"
        />
        <Button
          class="h-min"
          variant="tonal"
          severity="warn"
          label="Warn"
          icon="lucide:triangle-alert"
        />
        <Button
          class="h-min"
          variant="tonal"
          severity="info"
          label="Información"
          icon="lucide:info"
        />
        <Button
          class="h-min"
          variant="tonal"
          severity="success"
          label="Exito"
          icon="lucide:check"
        />
        <Button
          class="h-min"
          variant="tonal"
          severity="secondary"
          label="Secondary"
        />
      </div>

      <h2 class="mt-4 text-2xl font-semibold">Outlined con severidad</h2>
      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Button class="h-min" outlined label="Default" icon="lucide:log-in" />
        <Button
          class="h-min"
          outlined
          severity="danger"
          label="Danger"
          icon="lucide:octagon-alert"
        />
        <Button
          class="h-min"
          outlined
          severity="warn"
          label="Warn"
          icon="lucide:triangle-alert"
        />
        <Button
          class="h-min"
          outlined
          severity="info"
          label="Información"
          icon="lucide:info"
        />
        <Button
          class="h-min"
          outlined
          severity="success"
          label="Exito"
          icon="lucide:check"
        />
        <Button
          class="h-min"
          outlined
          severity="secondary"
          label="Secondary"
        />
      </div>

      <h2 class="mt-4 text-2xl font-semibold">
        Botones de solo ícono (default)
      </h2>
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <Button size="icon-sm" icon="icon-park-outline:edit" />
        <Button size="icon" icon="icon-park-outline:edit" />
        <Button size="icon-lg" icon="icon-park-outline:edit" />
        <Button
          size="icon-sm"
          severity="danger"
          icon="icon-park-outline:delete"
        />
        <Button
          size="icon"
          severity="danger"
          icon="icon-park-outline:delete"
        />
        <Button
          size="icon-lg"
          severity="danger"
          icon="icon-park-outline:delete"
        />
      </div>

      <h2 class="mt-4 text-2xl font-semibold">
        Botones de solo ícono (variant text) — caso de uso real en tarjetas
      </h2>
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <Button variant="text" size="icon-sm" icon="icon-park-twotone:edit" />
        <Button
          variant="text"
          size="icon-sm"
          severity="danger"
          icon="icon-park-outline:delete"
        />
        <Button
          variant="text"
          size="icon-sm"
          severity="success"
          icon="lucide:check"
        />
        <Button
          variant="text"
          size="icon-sm"
          severity="warn"
          icon="lucide:triangle-alert"
        />
        <Button
          variant="text"
          size="icon-sm"
          severity="info"
          icon="lucide:info"
        />
        <Button
          variant="text"
          size="icon-sm"
          severity="secondary"
          icon="lucide:more-horizontal"
        />
      </div>

      <h2 class="mt-4 text-2xl font-semibold">
        Botones de solo ícono (variant tonal)
      </h2>
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <Button
          variant="tonal"
          size="icon-sm"
          icon="icon-park-outline:edit"
        />
        <Button
          variant="tonal"
          size="icon-sm"
          severity="danger"
          icon="icon-park-outline:delete"
        />
      </div>

      <h2 class="mt-4 text-2xl font-semibold">Botones cargando</h2>

      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Button
          loading
          class="h-min"
          label="Iniciar sesión"
          icon="lucide:log-in"
          icon-pos="left"
        />
        <Button
          loading
          class="h-min"
          severity="danger"
          label="Danger"
          icon="lucide:octagon-alert"
          icon-pos="left"
        />
        <Button
          loading
          class="h-min"
          severity="warn"
          label="Warn"
          icon="lucide:triangle-alert"
          icon-pos="right"
        />
        <Button
          loading
          class="h-min"
          severity="info"
          label="Información"
          icon="lucide:info"
          icon-pos="bottom"
        />
        <Button
          loading
          class="h-min"
          severity="success"
          label="Exito"
          icon="lucide:check"
          icon-pos="top"
        />
        <Button loading class="h-min" severity="secondary" label="Secondary" />
        <Button loading class="h-min" outlined label="Outlined" />
      </div>

      <h2 class="mt-4 text-2xl font-semibold">Botones desactivados</h2>

      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Button
          disabled
          class="h-min"
          label="Desactivado"
          icon="lucide:log-in"
          icon-pos="left"
        />
        <Button
          disabled
          class="h-min"
          severity="danger"
          label="Desactivado"
          icon="lucide:octagon-alert"
          icon-pos="left"
        />
        <Button
          disabled
          class="h-min"
          severity="warn"
          label="Desactivado"
          icon="lucide:triangle-alert"
          icon-pos="right"
        />
        <Button
          disabled
          class="h-min"
          severity="info"
          label="Desactivado"
          icon="lucide:info"
          icon-pos="bottom"
        />
        <Button
          disabled
          class="h-min"
          severity="success"
          label="Desactivado"
          icon="lucide:check"
          icon-pos="top"
        />
        <Button
          disabled
          class="h-min"
          severity="secondary"
          label="Desactivado"
        />
        <Button disabled class="h-min" outlined label="Desactivado" />
      </div>
    </div>

    <div
      class="border-surface-950/45 bg-surface-50 rounded border p-4 lg:p-8 dark:bg-neutral-700"
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
                name="icon-park-outline:arrow-right"
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
                name="icon-park-outline:arrow-right"
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
                name="icon-park-outline:arrow-right"
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
                name="icon-park-outline:arrow-right"
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
              <Button
                label="Ver más"
                icon="icon-park-outline:arrow-right"
                variant="text"
                class="flex-1 text-xs"
              />
              <Button
                label="No me interesa"
                icon="lucide:circle-x"
                variant="text"
                class="flex-1 text-xs"
              />
            </div>
          </template>
        </CCardAlt>
        <CCardAlt title="Titulo" small="Texto pequeño" class="lg:col-span-2">
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
              <Button
                label="No me interesa"
                outlined
                icon="lucide:circle-x"
                class="flex-1 text-xs"
              />
              <Button
                label="Ver más"
                icon="icon-park-outline:arrow-right"
                class="h-full flex-1 text-xs"
              />
            </div>
          </template>
        </CCardAlt>
      </div>
    </div>

    <div
      class="border-surface-950/45 bg-surface-50 rounded border p-4 lg:p-8 dark:bg-neutral-700"
    >
      <h2 class="text-2xl font-semibold">Toast</h2>
      <p class="text-primary-emphasis-alt">Mensajes de notificación</p>

      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Button
          class="h-min"
          label="Iniciar sesión"
          @click="toast('Iniciando sesión...')"
        />
        <Button
          class="h-min"
          label="Con botón"
          @click="toast('Iniciando sesión...', { closeButton: true })"
        />
        <Button
          class="h-min"
          severity="danger"
          label="Error"
          icon="lucide:octagon-alert"
          @click="toast.error('Error al iniciar sesión')"
        />
        <Button
          class="h-min"
          severity="warn"
          label="Warn"
          icon="lucide:triangle-alert"
          @click="toast.warning('Advertencia')"
        />
        <Button
          class="h-min"
          severity="info"
          label="Información"
          icon="lucide:info"
          @click="toast.info('Información')"
        />
        <Button
          class="h-min"
          severity="success"
          label="Exito"
          icon="lucide:check"
          @click="toast.success('Exito')"
        />
      </div>
    </div>

    <div
      class="border-surface-950/45 bg-surface-50 rounded border p-4 lg:p-8 dark:bg-neutral-700"
    >
      <h2 class="text-2xl font-semibold">Input</h2>
      <p class="text-primary-emphasis-alt">Input de texto</p>

      <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CInputText v-model="text" clearable placeholder="Normal" />
        <CInputText
          v-model="text"
          placeholder="Icono inicio"
          prepend-icon="lucide:mail"
        />
        <CInputText
          v-model="text"
          placeholder="Icono final"
          append-icon="lucide:wind"
        />
        <CInputText
          v-model="text"
          placeholder="Iconos inicio y final"
          prepend-icon="lucide:mail"
          append-icon="lucide:wind"
        />
        <CInputText
          v-model="text"
          placeholder="Botón inicio"
          prepend-icon="lucide:wind"
          @click:prepend="toast('Click en el icono')"
        />
        <CInputText
          v-model="text"
          placeholder="Botón final"
          append-icon="lucide:wind"
          @click:append="toast('Click en el icono')"
        />
        <CInputText
          v-model="text"
          placeholder="Botones inicio y final"
          prepend-icon="lucide:mail"
          append-icon="lucide:wind"
          @click:prepend="toast('Click en el icono')"
          @click:append="toast('Click en el icono')"
        />
        <CInputText
          v-model="text"
          placeholder="Sin bordes"
          prepend-icon="lucide:mail"
          append-icon="lucide:wind"
          no-borders
          @click:prepend="toast('Click en el icono')"
          @click:append="toast('Click en el icono')"
        />
        <CInputText
          v-model="text"
          placeholder="Clereable"
          prepend-icon="lucide:mail"
          append-icon="lucide:wind"
          no-borders
          clearable
          @click:prepend="toast('Click en el icono')"
          @click:append="toast('Click en el icono')"
        />
      </div>
    </div>

    <div
      class="border-surface-950/45 bg-surface-50 rounded border p-4 lg:p-8 dark:bg-neutral-700"
    >
      <h2 class="text-2xl font-semibold">Menú</h2>
      <div class="mt-4 flex items-center gap-4">
        <KebabMenu>
          <template #title>
            <h2 class="mb-2 font-semibold">Opciones</h2>
          </template>
          <div class="flex flex-col gap-1">
            <button class="menu-item">Editar</button>
            <button class="menu-item">Eliminar</button>
            <button class="menu-item">Compartir</button>
          </div>
        </KebabMenu>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toast } from 'vue-sonner'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import KebabMenu from '~/components/partials/KebabMenu.vue'

const text = ref('')
</script>
<style lang="postcss" scoped></style>
