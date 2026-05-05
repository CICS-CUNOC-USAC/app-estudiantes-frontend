<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:people-plus"
          class="mr-1.5 mb-1 inline-block"
        />
        Crear usuario administrativo
      </h1>
    </header>
    <section class="mt-4">
      <form id="form-vee-demo" @submit="onSubmit">
        <FieldGroup class="gap-4">
          <h2 class="font-medium">Información del usuario</h2>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <VeeField v-slot="{ field, errors }" name="first_name">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="field"
                  label="Nombres"
                  id="first_name"
                  no-borders
                  prepend-icon="icon-park-twotone:people"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="last_name">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="field"
                  label="Apellidos"
                  id="last_name"
                  no-borders
                  prepend-icon="icon-park-twotone:people"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="email">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="field"
                  label="Correo electrónico"
                  id="email"
                  no-borders
                  prepend-icon="icon-park-twotone:mail"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="password">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="field"
                  label="Contraseña inicial"
                  id="password"
                  type="password"
                  no-borders
                  prepend-icon="icon-park-twotone:lock"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>

          <h2 class="font-medium">Roles y permisos</h2>

          <VeeField v-slot="{ field, errors }" name="roles_ids">
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
                  <SelectValue placeholder="Selecciona uno o varios roles">
                    <template v-if="field.value.length">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-if="field.value.length <= 3"
                          v-for="id in field.value"
                          :key="id"
                          class="inline-flex items-center gap-1 rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-medium dark:bg-neutral-700"
                        >
                          {{ roles?.results?.find((r) => r.id === id)?.name }}
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-medium dark:bg-neutral-700"
                        >
                          {{ field.value.length }} roles seleccionados
                        </span>
                      </div>
                    </template>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-if="statusRoles === 'pending'"
                      value="__loading__"
                      disabled
                      class="text-muted-foreground"
                    >
                      Cargando roles...
                    </SelectItem>
                    <SelectItem
                      v-for="role in roles?.results"
                      :key="role.id"
                      :value="role.id"
                    >
                      <span class="font-medium">{{ role.name }}</span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
        </FieldGroup>

        <div class="mt-4 space-x-4">
          <Button
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            to="/admin/users"
            severity="secondary"
          />
          <Button
            label="Guardar"
            icon="icon-park-outline:check"
            type="submit"
            :loading="asyncStatus === 'loading'"
            class=""
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
import CInputText from '~/components/primitives/form/CInputText.vue'
import Button from '~/components/ui/button/Button.vue'
import { Field, FieldError, FieldGroup } from '~/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { getAllRoles } from '~/lib/api/admin/roles'
import { createStaff } from '~/lib/api/admin/users'

const formSchema = z.object({
  first_name: z.string().nonempty('El nombre es requerido'),
  last_name: z.string().nonempty('El apellido es requerido'),
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().nonempty('La contraseña es requerida'),
  roles_ids: z.array(z.number()).min(1, 'Al menos un rol es requerido')
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    roles_ids: []
  }
})

const onSubmit = handleSubmit((values) => {
  mutate(values)
})

const { mutate, asyncStatus } = useMutation({
  mutation: (staffData: StaffPayload) => createStaff(staffData),
  onError(error) {
    toast.error('Ocurrió un error al guardar el usuario', {
      description: `
      Parece que los datos no son válidos:
      ${(error as FetchError).data.message.join(', ')}
      `
    })
  },
  onSuccess() {
    toast.success('Usuario guardado correctamente')
    navigateTo('/admin/users')
  }
})

const {
  data: roles,
  status: statusRoles,
  error
} = await useAsyncData('roles', () => getAllRoles())

definePageMeta({
  layout: 'admin'
})
</script>
<style scoped></style>
