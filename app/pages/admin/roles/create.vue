<template>
  <main class="pb-8">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:id-card-h"
          class="mr-1.5 mb-1 inline-block"
        />
        Crear rol de usuario
      </h1>
    </header>
    <section class="mt-4">
      <h2 class="mb-2 font-medium">Información del rol</h2>
      <PForm
        :initial-values
        :resolver
        v-slot="$form"
        @submit="saveRole"
      >
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CInputText
            label="Nombre"
            name="name"
            id="name"
            no-borders
            prepend-icon="icon-park-twotone:tag"
            :error="$form.name?.error?.message"
          />
          <CInputText
            label="Alias"
            name="alias"
            id="alias"
            no-borders
            prepend-icon="icon-park-twotone:tag"
            :error="$form.alias?.error?.message"
          />
          <CInputText
            label="Descripción"
            name="description"
            id="description"
            no-borders
            prepend-icon="icon-park-twotone:file-text"
            :error="$form.description?.error?.message"
          />
        </div>

        <h2 class="mt-4 mb-2 font-medium">Permisos</h2>

        <div class="w-full lg:w-1/2">
          <Select multiple v-model="selectedPermissions">
            <SelectTrigger
              class="h-auto min-h-12 w-full rounded-lg border-black bg-surface-50 px-3 py-1.5 dark:border-surface-700 dark:bg-surface-900"
            >
              <SelectValue placeholder="Selecciona uno o varios permisos">
                <template v-if="selectedPermissions.length">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-if="selectedPermissions.length <= 3"
                      v-for="id in selectedPermissions"
                      :key="id"
                      class="inline-flex items-center gap-1 rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-medium dark:bg-neutral-700"
                    >
                      {{ permissions?.results?.find(p => p.id === id)?.name }}
                      <button
                        type="button"
                        class="ml-0.5 cursor-pointer opacity-60 hover:opacity-100"
                        @click.stop="selectedPermissions = selectedPermissions.filter(i => i !== id)"
                      >
                        <Icon name="lucide:x" class="size-3" />
                      </button>
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-medium dark:bg-neutral-700"
                    >
                      {{ selectedPermissions.length }} permisos seleccionados
                    </span>
                  </div>
                </template>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-if="statusPermissions === 'pending'"
                  value="__loading__"
                  disabled
                  class="text-muted-foreground"
                >
                  Cargando permisos...
                </SelectItem>
                <SelectItem
                  v-for="permission in permissions?.results"
                  :key="permission.id"
                  :value="permission.id"
                >
                  <span class="font-medium">{{ permission.name }}</span>
                  <span class="text-muted-foreground text-xs">
                    Acción: <span class="font-semibold">"{{ permission.action }}"</span> Sobre: <span class="font-semibold">"{{ permission.subject }}"</span>
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div
            v-if="permissionsError"
            class="mt-1.5 text-xs font-medium text-red-500"
          >
            {{ permissionsError }}
          </div>
        </div>

        <div class="flex gap-4 mt-4">
          <Button
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            to="/admin/roles"
            severity="secondary"
          />
          <Button
            label="Guardar"
            icon="icon-park-outline:check"
            type="submit"
            class=""
            :loading="asyncStatus === 'loading'"
          />
        </div>
      </PForm>
    </section>
  </main>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { FetchError } from 'ofetch'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { getAllPermissions } from '~/lib/api/admin/permissions'
import { createRole } from '~/lib/api/admin/roles'

const selectedPermissions = ref<number[]>([])
const permissionsError = ref('')

const initialValues = reactive({
  name: '',
  alias: '',
  description: '',
})

const resolver = zodResolver(
  z.object({
    name: z.string().nonempty('El nombre es requerido'),
    alias: z.string().nonempty('El alias es requerido'),
    description: z.string().nonempty('La descripción es requerida'),
  })
)

const { mutate, asyncStatus } = useMutation({
  mutation: (data: Role) => createRole(data),
  onError(error) {
    toast.error('Ocurrió un error al guardar el rol', {
      description: `
      Parece que los datos no son válidos:
      ${(error as FetchError).data.message.join(', ')}
      `
    })
  },
  onSuccess() {
    toast.success('Rol creado exitosamente')
    navigateTo('/admin/roles')
  }
})

const {
  data: permissions,
  status: statusPermissions,
  error
} = await useAsyncData('roles-permissions', () => getAllPermissions(), {
  lazy: true
})

const saveRole = async (e: FormSubmitEvent) => {
  permissionsError.value = selectedPermissions.value.length === 0
    ? 'Debes seleccionar al menos un permiso'
    : ''
  if (e.valid && !permissionsError.value) {
    mutate({ ...e.values, permissions_ids: selectedPermissions.value })
  }
}

definePageMeta({
  layout: 'admin',
  subject: ['Roles', 'all'],
  action: ['manage']
})
</script>
<style scoped></style>
