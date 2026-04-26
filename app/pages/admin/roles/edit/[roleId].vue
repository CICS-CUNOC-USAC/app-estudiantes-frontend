<template>
  <main class="pb-8">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:id-card-h"
          class="mr-1.5 mb-1 inline-block"
        />
        Editar rol de usuario
      </h1>
    </header>

    <ElementNotFound
      v-if="statusRole === 'error' && !role"
      element-type="rol"
      backToLabel="Regresar a la lista de roles"
      backToRoute="/admin/roles"
      class="mt-4"
    />

    <section class="mt-4" v-if="role">
      <h2 class="mb-2 font-medium">Informacion del rol</h2>
      <PForm
        :initial-values
        :resolver
        v-slot="$form"
        @submit="saveRole"
      >
        <fieldset :disabled="asyncStatus === 'loading'" class="disabled:opacity-60">
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
              label="Descripcion"
              name="description"
              id="description"
              no-borders
              prepend-icon="icon-park-twotone:file-text"
              :error="$form.description?.error?.message"
            />
          </div>

          <h2 class="mt-4 mb-2 font-medium">Permisos</h2>

          <div class="w-full lg:w-1/2">
            <PMultiSelect
              name="permissions_ids"
              fluid
              display="chip"
              selected-items-label="{0} permisos seleccionados"
              placeholder="Selecciona uno o varios permisos"
              :options="permissions?.results"
              :loading="statusPermissions === 'pending'"
              option-value="id"
              option-label="name"
              :maxSelectedLabels="3"
              show-clear
              :show-toggle-all="false"
              :pt="{
                pcChip: {
                  root: {
                    class: 'bg-neutral-200! dark:bg-neutral-700!'
                  }
                },
                label: {
                  class: 'text-sm'
                },
                optionLabel: {
                  class: 'text-sm'
                }
              }"
            >
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ option.name }}</span>
                  <span class="text-sm"
                    ><span class="text-muted-color">Accion:</span>
                    <span class="font-medium italic">"{{ option.action }}"</span>
                  </span>
                  <span class="text-sm"
                    ><span class="text-muted-color">Sobre:</span>
                    <span class="font-medium italic"
                      >"{{ option.subject }}"</span
                    ></span
                  >
                </div>
              </template>
            </PMultiSelect>

            <div
              v-if="$form.permissions_ids?.invalid"
              severity="error"
              variant="simple"
              class="mt-1.5 text-xs font-medium text-red-500"
            >
              {{ $form.permissions_ids?.error?.message }}
            </div>
          </div>
        </fieldset>

        <div class="flex gap-4 mt-4">
          <CButton
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            to="/admin/roles"
            severity="secondary"
          />
          <CButton
            label="Guardar"
            icon="icon-park-outline:check"
            type="submit"
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
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { getAllPermissions } from '~/lib/api/admin/permissions'
import { fetchRole, updateRole } from '~/lib/api/admin/roles'

const { params } = useRoute()

const {
  data: roleResponse,
  status: statusRole
} = await useAsyncData(`edit-role-${params.roleId}`, () => fetchRole(Number(params.roleId)))

const role = computed(() => roleResponse.value?.result)

const initialValues = reactive({
  name: role.value?.name,
  alias: role.value?.alias,
  description: role.value?.description,
  permissions_ids: role.value?.permissions?.map((permission) => permission.id) || []
})

const resolver = zodResolver(
  z.object({
    name: z.string().nonempty('El nombre es requerido'),
    alias: z.string().nonempty('El alias es requerido'),
    description: z.string().nonempty('La descripcion es requerida'),
    permissions_ids: z.array(z.number()).nonempty('Debes seleccionar al menos un permiso')
  })
)

const { mutate, asyncStatus } = useMutation({
  mutation: (data: Role) => updateRole(Number(params.roleId), data),
  onError(error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message

    toast.error('Ocurrio un error al actualizar el rol', {
      description: `
      Parece que los datos no son validos:
      ${parsedMessage}
      `
    })
  },
  onSuccess() {
    toast.success('Rol actualizado exitosamente')
    navigateTo('/admin/roles')
  }
})

const {
  data: permissions,
  status: statusPermissions
} = await useAsyncData('roles-permissions', () => getAllPermissions(), {
  lazy: true
})

const saveRole = async (e: FormSubmitEvent) => {
  if (e.valid) {
    mutate(e.values as Role)
  }
}

definePageMeta({
  layout: 'admin',
  subject: ['Roles', 'all'],
  action: ['manage']
})
</script>
<style scoped></style>
