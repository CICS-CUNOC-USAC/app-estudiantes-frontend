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
      <form @submit="onSubmit">
        <FieldGroup :disabled="asyncStatus === 'loading'" class="disabled:opacity-60">
          <h2 class="mb-2 font-medium">Informacion del rol</h2>
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <VeeField v-slot="{ componentField, errors }" name="name">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Nombre"
                  id="name"
                  no-borders
                  prepend-icon="icon-park-twotone:tag"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ componentField, errors }" name="alias">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Alias"
                  id="alias"
                  no-borders
                  prepend-icon="icon-park-twotone:tag"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ componentField, errors }" name="description">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Descripcion"
                  id="description"
                  no-borders
                  prepend-icon="icon-park-twotone:file-text"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>

          <h2 class="mt-4 mb-2 font-medium">Permisos</h2>

          <div class="w-full lg:w-1/2">
            <VeeField v-slot="{ field, errors }" name="permissions_ids">
              <Field :data-invalid="!!errors.length">
                <Select
                  multiple
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                >
                  <SelectTrigger
                    class="bg-surface-50 dark:border-surface-700 dark:bg-surface-900 h-auto min-h-12 w-full rounded-lg border-black px-3 py-1.5"
                  >
                    <SelectValue placeholder="Selecciona uno o varios permisos">
                      <template v-if="field.value?.length">
                        <div class="flex flex-wrap gap-1">
                          <span
                            v-if="field.value.length <= 3"
                            v-for="id in field.value"
                            :key="id"
                            class="inline-flex items-center gap-1 rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-medium dark:bg-neutral-700"
                          >
                            {{ permissions?.results?.find((p) => p.id === id)?.name }}
                          </span>
                          <span
                            v-else
                            class="inline-flex items-center rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-medium dark:bg-neutral-700"
                          >
                            {{ field.value.length }} permisos seleccionados
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
                        <div class="flex items-center gap-2">
                          <span class="font-medium">{{ permission.name }}</span>
                          <span class="text-sm">
                            <span class="text-muted-foreground">Accion:</span>
                            <span class="font-medium italic">"{{ permission.action }}"</span>
                          </span>
                          <span class="text-sm">
                            <span class="text-muted-foreground">Sobre:</span>
                            <span class="font-medium italic">"{{ permission.subject }}"</span>
                          </span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </div>
        </FieldGroup>

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
            :loading="asyncStatus === 'loading'"
          />
        </div>
      </form>
    </section>
  </main>
</template>
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { FetchError } from 'ofetch'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Field, FieldError, FieldGroup } from '~/components/ui/field'
import { getAllPermissions } from '~/lib/api/admin/permissions'
import { fetchRole, updateRole } from '~/lib/api/admin/roles'

const { params } = useRoute()

const {
  data: roleResponse,
  status: statusRole
} = await useAsyncData(`edit-role-${params.roleId}`, () => fetchRole(Number(params.roleId)))

const role = computed(() => roleResponse.value?.result)

const initialValues = computed(() => {
  if (!role.value) return {}
  return {
    name: role.value.name,
    alias: role.value.alias,
    description: role.value.description,
    permissions_ids: role.value.permissions?.map((permission) => permission.id) ?? []
  }
})

const formSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  alias: z.string().nonempty('El alias es requerido'),
  description: z.string().nonempty('La descripcion es requerida'),
  permissions_ids: z.array(z.number()).nonempty('Debes seleccionar al menos un permiso')
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: initialValues.value
})

const onSubmit = handleSubmit((values) => {
  mutate(values as Role)
})

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

definePageMeta({
  layout: 'admin',
  subject: ['Roles', 'all'],
  action: ['manage']
})
</script>
<style scoped></style>
