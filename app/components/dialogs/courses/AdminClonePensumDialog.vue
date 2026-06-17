<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Clonar pensum existente</DialogTitle>
        <DialogDescription>
          Crear un nuevo pensum a partir de uno existente. Se copian cursos, areas y prerequisitos.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit">
        <FieldGroup :disabled="asyncStatus === 'loading'" class="!gap-3 disabled:opacity-60">
          <VeeField v-slot="{ field, errors }" name="sourcePensumId">
            <Field :data-invalid="!!errors.length">
              <label class="text-muted-foreground mb-1 block text-sm">Pensum de origen</label>
              <Select
                :model-value="field.value"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              >
                <SelectTrigger
                  class="bg-surface-50 dark:border-surface-700 dark:bg-surface-900 h-auto min-h-12 w-full rounded-lg border-black px-3 py-1.5"
                >
                  <SelectValue placeholder="Seleccionar pensum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="pensum in pensums"
                      :key="pensum.id"
                      :value="pensum.id"
                    >
                      {{ pensum.career?.name ?? `Carrera ${pensum.career_code}` }} — {{ pensum.year }}
                      <span v-if="pensum.active" class="text-green-600 ml-1 text-xs">(Activo)</span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span v-if="errors.length" class="text-destructive text-xs">{{ errors[0] }}</span>
            </Field>
          </VeeField>

          <VeeField v-slot="{ componentField, errors }" name="year">
            <Field :data-invalid="!!errors.length">
              <CInputText
                v-bind="componentField"
                label="Ano del nuevo pensum"
                id="clone-pensum-year"
                type="number"
                no-borders
                prepend-icon="icon-park-twotone:calendar"
                :error="errors[0]"
              />
            </Field>
          </VeeField>
        </FieldGroup>

        <p class="text-muted-foreground mt-3 text-xs">
          El nuevo pensum se creara como <strong>inactivo</strong>.
        </p>

        <DialogFooter class="mt-4">
          <DialogClose as-child>
            <Button severity="secondary" label="Cancelar" />
          </DialogClose>
          <Button
            label="Clonar pensum"
            icon="icon-park-outline:copy"
            type="submit"
            :loading="asyncStatus === 'loading'"
          />
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { FetchError } from 'ofetch'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { Field, FieldGroup } from '~/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { clonePensum, type ClonePensumPayload } from '~/lib/api/admin/pensums'
import type { Pensum } from '~/utils/types/pensum-courses'

defineProps<{
  pensums: Pensum[]
}>()

const emit = defineEmits<{
  cloned: []
}>()

const open = ref(false)

const formSchema = z.object({
  sourcePensumId: z.number({ required_error: 'Selecciona un pensum de origen', invalid_type_error: 'Selecciona un pensum de origen' }),
  year: z.coerce.number({ required_error: 'El ano es requerido', invalid_type_error: 'Debe ser un numero valido' }).int().min(1900, 'Ano invalido').max(2100, 'Ano invalido'),
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    sourcePensumId: undefined,
    year: undefined,
  }
})

watch(open, (val) => {
  if (val) resetForm()
})

const onSubmit = handleSubmit((values) => {
  mutate(values as ClonePensumPayload)
})

const { mutate, asyncStatus } = useMutation({
  mutation: (data: ClonePensumPayload) => clonePensum(data),
  onError(error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Error al clonar el pensum', { description: `Detalle: ${parsedMessage}` })
  },
  onSuccess() {
    toast.success('Pensum clonado exitosamente')
    open.value = false
    emit('cloned')
  }
})
</script>
