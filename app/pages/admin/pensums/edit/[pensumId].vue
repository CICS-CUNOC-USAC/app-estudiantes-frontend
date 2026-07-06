<template>
  <main class="pb-8">
    <nav>
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a pensums"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/admin/pensums"
      />
    </nav>

    <header>
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:notebook-one"
          class="mr-1.5 mb-1 inline-block"
        />
        Editar pensum
      </h1>
      <template v-if="statusPensum === 'pending'">
        <Skeleton height="1.2rem" width="16rem" class="mt-2" />
      </template>
      <p v-else-if="pensum" class="text-muted-color-emphasis mt-1 text-sm">
        {{ pensum.career?.name ?? `Carrera: ${pensum.career_code}` }} — Pensum {{ pensum.year }}
      </p>
    </header>

    <ElementNotFound
      v-if="statusPensum === 'error' && !pensum"
      element-type="pensum"
      backToLabel="Regresar a la lista de pensums"
      backToRoute="/admin/pensums"
      class="mt-4"
    />

    <section class="mt-6" v-if="pensum">
      <Card class="max-w-2xl">
        <CardHeader class="pb-2">
          <CardTitle class="text-base font-medium">Informacion del pensum</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit">
            <FieldGroup :disabled="asyncStatus === 'loading'" class="disabled:opacity-60">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <VeeField v-slot="{ componentField, errors }" name="career_code">
                  <Field :data-invalid="!!errors.length">
                    <CInputText
                      v-bind="componentField"
                      label="Codigo de carrera"
                      id="career_code"
                      type="number"
                      no-borders
                      prepend-icon="icon-park-twotone:id-card-h"
                      :error="errors[0]"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="year">
                  <Field :data-invalid="!!errors.length">
                    <CInputText
                      v-bind="componentField"
                      label="Ano"
                      id="year"
                      type="number"
                      no-borders
                      prepend-icon="icon-park-twotone:calendar"
                      :error="errors[0]"
                    />
                  </Field>
                </VeeField>
              </div>

              <div class="mt-4 flex items-center gap-3">
                <label class="flex cursor-pointer items-center gap-2.5">
                  <Switch v-model="isActive" />
                  <div>
                    <span class="text-sm font-medium">Activo</span>
                    <span class="text-muted-color-emphasis block text-xs">
                      Marcar como el pensum vigente
                    </span>
                  </div>
                </label>
              </div>

              <Separator class="my-4" />

              <div class="flex items-center justify-between">
                <div class="flex gap-3">
                  <Button
                    label="Cancelar"
                    icon="icon-park-outline:arrow-left"
                    to="/admin/pensums"
                    severity="secondary"
                  />
                  <Button
                    label="Guardar cambios"
                    icon="icon-park-outline:check"
                    type="submit"
                    :loading="asyncStatus === 'loading'"
                  />
                </div>
                <ConfirmDialog
                  title="¿Eliminar este pensum?"
                  description="El pensum y todas sus relaciones seran eliminados permanentemente."
                  @confirm="onDelete"
                >
                  <Button
                    label="Eliminar"
                    icon="icon-park-outline:delete"
                    severity="danger"
                    variant="tonal"
                    type="button"
                    :loading="deleteStatus === 'loading'"
                  />
                </ConfirmDialog>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </section>
  </main>
</template>
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { FetchError } from 'ofetch'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog.vue'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import Button from '~/components/ui/button/Button.vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { Switch } from '~/components/ui/switch'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { Field, FieldGroup } from '~/components/ui/field'
import { fetchPensum, updatePensum, deletePensum, type UpdatePensumPayload } from '~/lib/api/admin/pensums'

const { params } = useRoute()

const {
  data: pensumResponse,
  status: statusPensum
} = await useAsyncData(`edit-pensum-${params.pensumId}`, () => fetchPensum(Number(params.pensumId)))

const pensum = computed(() => pensumResponse.value?.result)

const isActive = ref(pensum.value?.active ?? false)

const formSchema = z.object({
  career_code: z.coerce.number({ required_error: 'El codigo de carrera es requerido', invalid_type_error: 'Debe ser un numero valido' }).int().positive('Debe ser un numero positivo'),
  year: z.coerce.number({ required_error: 'El ano es requerido', invalid_type_error: 'Debe ser un numero valido' }).int().min(1900, 'Ano invalido').max(2100, 'Ano invalido'),
})

const { handleSubmit, setValues } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    career_code: pensum.value?.career_code,
    year: pensum.value?.year,
  }
})

watch(pensum, (val) => {
  if (val) {
    isActive.value = val.active
    setValues({
      career_code: val.career_code,
      year: val.year,
    })
  }
})

const onSubmit = handleSubmit((values) => {
  mutate({ ...values, active: isActive.value } as UpdatePensumPayload)
})

const { mutate, asyncStatus } = useMutation({
  mutation: (data: UpdatePensumPayload) => updatePensum(Number(params.pensumId), data),
  onError(error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message

    toast.error('Ocurrio un error al actualizar el pensum', {
      description: `Detalle: ${parsedMessage}`
    })
  },
  onSuccess() {
    toast.success('Pensum actualizado exitosamente')
    navigateTo('/admin/pensums')
  }
})

const { mutate: mutateDelete, asyncStatus: deleteStatus } = useMutation({
  mutation: () => deletePensum(Number(params.pensumId)),
  onError(error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message

    toast.error('Ocurrio un error al eliminar el pensum', {
      description: `Detalle: ${parsedMessage}`
    })
  },
  onSuccess() {
    toast.success('Pensum eliminado exitosamente')
    navigateTo('/admin/pensums')
  }
})

function onDelete() {
  mutateDelete()
}

definePageMeta({
  layout: 'admin',
  subject: ['Pensum', 'all'],
  action: ['manage']
})
</script>
<style scoped></style>
