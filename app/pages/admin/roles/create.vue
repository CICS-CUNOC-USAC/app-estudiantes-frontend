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
      <form id="form-role" @submit="onSubmit">
        <FieldGroup class="gap-4">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <VeeField v-slot="{ field, errors }" name="name">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="field"
                  label="Nombre"
                  name="name"
                  id="name"
                  no-borders
                  prepend-icon="icon-park-twotone:tag"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="alias">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="field"
                  label="Alias"
                  name="alias"
                  id="alias"
                  no-borders
                  prepend-icon="icon-park-twotone:tag"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="description">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="field"
                  label="Descripción"
                  name="description"
                  id="description"
                  no-borders
                  prepend-icon="icon-park-twotone:file-text"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>

          <h2 class="font-medium">Permisos</h2>

          <!-- NOTE: Campo de permisos controlado manualmente -->
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
                    <template v-if="field.value.length">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-if="field.value.length <= 3"
                          v-for="id in field.value"
                          :key="id"
                          class="inline-flex items-center gap-1 rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-medium dark:bg-neutral-700"
                        >
                          {{
                            permissions?.results?.find((p) => p.id === id)?.name
                          }}
                          <button
                            type="button"
                            class="ml-0.5 cursor-pointer opacity-60 hover:opacity-100"
                            @click.stop="
                              field.value = field.value.filter(
                                (i: string) => i !== id
                              )
                            "
                          >
                            <Icon name="lucide:x" class="size-3" />
                          </button>
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
                      <span class="font-medium">{{ permission.name }}</span>
                      <span class="text-muted-foreground text-xs">
                        Acción:
                        <span class="font-semibold"
                          >"{{ permission.action }}"</span
                        >
                        Sobre:
                        <span class="font-semibold"
                          >"{{ permission.subject }}"</span
                        >
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent> </Select
              ><FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <div class="mt-4 flex gap-4">
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
        </FieldGroup>
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
import { createRole } from '~/lib/api/admin/roles'
import type { RolePayload } from '~/stores/staff-auth'

const formSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  alias: z.string().nonempty('El alias es requerido'),
  description: z.string().nonempty('La descripción es requerida'),
  permissions_ids: z
    .array(z.number())
    .min(1, 'Al menos un permiso es requerido')
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: '',
    alias: '',
    description: '',
    permissions_ids: []
  }
})

const onSubmit = handleSubmit((values) => {
  mutate(values)
})

const { mutate, asyncStatus } = useMutation({
  mutation: (data: RolePayload) => createRole(data),
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

definePageMeta({
  layout: 'admin',
  subject: ['Roles', 'all'],
  action: ['manage']
})
</script>
<style scoped></style>
