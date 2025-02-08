<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:people-plus"
          class="mr-1.5 mb-1 inline-block"
        />
        Editar usuario administrativo
      </h1>
    </header>
    <ElementNotFound
      v-if="status === 'error' && !user"
      element-type="usuario"
      backToLabel="Regresar a la lista de usuarios"
      backToRoute="/admin/users"
      class="mt-4"
    />

    <CMessage
      v-if="isSameUser"
      title="No es posible editar tu propio usuario"
      class="mt-4"
    />
    <section class="mt-4" v-if="user">
      <PForm :initial-values :resolver v-slot="$form" @submit="saveUser">
        <h2 class="my-2 font-medium">Información del usuario</h2>
        <fieldset
          :disabled="asyncStatus === 'loading' || isSameUser"
          class="disabled:opacity-60"
        >
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CInputText
              label="Nombres"
              name="first_name"
              id="first_name"
              no-borders
              prepend-icon="icon-park-twotone:people"
              :error="$form.first_name?.error?.message"
            />
            <CInputText
              label="Apellidos"
              name="last_name"
              id="last_name"
              no-borders
              prepend-icon="icon-park-twotone:people"
              :error="$form.last_name?.error?.message"
            />
            <CInputText
              label="Correo electrónico"
              name="email"
              id="email"
              no-borders
              prepend-icon="icon-park-twotone:mail"
              :error="$form.email?.error?.message"
            />
            <CInputText
              label="Nueva contraseña inicial"
              name="password"
              id="password"
              type="password"
              no-borders
              prepend-icon="icon-park-twotone:lock"
              :error="$form.password?.error?.message"
            />
          </div>
          <h2 class="mt-4 mb-2 font-medium">Roles y permisos asignados</h2>

          <div class="w-full lg:w-1/2">
            <PMultiSelect
              name="roles_ids"
              fluid
              display="chip"
              selected-items-label="{0} roles seleccionados"
              placeholder="Selecciona uno o varios roles"
              :options="roles?.results"
              :loading="status_roles === 'pending'"
              disabled
              option-label="name"
              option-value="id"
              :maxSelectedLabels="3"
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
            />

            <div
              v-if="$form.roles_ids?.invalid"
              severity="error"
              variant="simple"
              class="mt-1.5 text-xs font-medium text-red-500"
            >
              {{ $form.roles_ids?.error?.message }}
            </div>
          </div>
        </fieldset>
        <div class="mt-4 space-x-4">
          <CButton
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            to="/admin/users"
            class=""
            severity="secondary"
          />
          <CButton
            label="Guardar"
            icon="icon-park-outline:check"
            :disabled="isSameUser || asyncStatus === 'loading'"
            type="submit"
            class=""
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
import CMessage from '~/components/partials/CMessage.vue'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { getAllRoles } from '~/lib/api/admin/roles'
import { fetchStaff, updateStaff } from '~/lib/api/admin/users'

const { params } = useRoute()
const { data: user, status } = await useAsyncData('edit-user', () =>
  fetchStaff(+params.userId)
)

const { user: userLoggedIn } = useAuthStore()

const isSameUser = computed(() => userLoggedIn?.id === user.value?.id)

const initialValues = reactive({
  first_name: user.value?.first_name,
  last_name: user.value?.last_name,
  email: user.value?.email,
  password: '',
  roles_ids: user.value?.roles.map((role) => role.id)
})

const resolver = zodResolver(
  z
    .object({
      first_name: z.string().nonempty('El nombre es requerido'),
      last_name: z.string().nonempty('El apellido es requerido'),
      email: z.string().email('El correo electrónico no es válido'),
      password: z.string(),
      roles_ids: z.array(z.number()).nonempty('Al menos un rol es requerido')
    })
    .transform((data) => ({
      ...data,
      password: data.password || undefined
    }))
)

// trying to use 'pinia colada'
const { mutate, asyncStatus } = useMutation({
  mutation: (staffData: StaffPayload) => updateStaff(+params.userId, staffData),
  onError(error) {
    toast.error('Ocurrió un error al actualizar el usuario', {
      description: `
      Parece que los datos no son válidos:
      ${(error as FetchError).data.message.join(', ')}
      `
    })
  },
  onSuccess() {
    toast.success('Usuario actualizado correctamente')
    navigateTo('/admin/users')
  }
})

const saveUser = async (e: FormSubmitEvent) => {
  if (e.valid) {
    console.log(e.values)
    mutate(e.values as StaffPayload)
  }
}

const {
  data: roles,
  status: status_roles,
  error
} = await useAsyncData('roles', () => getAllRoles())

definePageMeta({
  layout: 'admin'
})
</script>
<style scoped></style>
