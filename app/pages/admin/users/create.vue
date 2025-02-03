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
      <PForm :initial-values :resolver v-slot="$form" @submit="saveUser">
        <h2 class="my-2 font-medium">Información del usuario</h2>
        <fieldset
        :disabled="asyncStatus === 'loading'"
        class="grid grid-cols-1 gap-4 lg:grid-cols-2 disabled:opacity-60"
        >
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
            label="Contraseña inicial"
            name="password"
            id="password"
            type="password"
            no-borders
            prepend-icon="icon-park-twotone:lock"
            :error="$form.password?.error?.message"
          />
        </fieldset>

        <div class="mt-4 space-x-4">
          <CButton
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            to="/admin/users"
            severity="secondary"
            class=""
          />
          <CButton
            label="Guardar"
            icon="icon-park-outline:check"
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
import { toast } from 'vue-sonner'
import { z } from 'zod'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { createStaff } from '~/lib/api/admin/users'
import { FetchError } from 'ofetch'

const initialValues = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: ''
})

const resolver = zodResolver(
  z.object({
    first_name: z.string()
    // .nonempty('El nombre es requerido')
    ,
    last_name: z.string()
    // .nonempty('El apellido es requerido')
    ,
    email: z.string().email('El correo electrónico no es válido'),
    password: z.string().nonempty('La contraseña es requerida')
  })
)

// trying to use 'pinia colada'
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

const saveUser = async (e: FormSubmitEvent) => {
  if (e.valid) {
    console.log(e.values)
    mutate(e.values as StaffPayload)
  }
}

definePageMeta({
  layout: 'admin'
})
</script>
<style scoped></style>
