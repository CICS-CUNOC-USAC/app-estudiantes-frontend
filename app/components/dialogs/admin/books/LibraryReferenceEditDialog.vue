<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="lg:max-w-md">
      <DialogHeader>
        <DialogTitle>Editar referencia</DialogTitle>
      </DialogHeader>
      <form @submit="onSubmit" class="space-y-4">
        <VeeField v-slot="{ componentField, errors }" name="edition">
          <Field :data-invalid="!!errors.length">
            <CInputText
              v-bind="componentField"
              label="Edición"
              id="edition"
              no-borders
              prepend-icon="icon-park-twotone:bookshelf"
              :error="errors[0]"
            />
          </Field>
        </VeeField>

        <VeeField v-slot="{ componentField, errors }" name="location">
          <Field :data-invalid="!!errors.length">
            <CInputText
              v-bind="componentField"
              label="Ubicación"
              id="location"
              no-borders
              prepend-icon="icon-park-twotone:local"
              :error="errors[0]"
            />
          </Field>
        </VeeField>

        <DialogFooter class="mt-2 flex gap-4 sm:justify-start">
          <DialogClose as-child>
            <Button
              label="Cancelar"
              icon="icon-park-outline:arrow-left"
              severity="secondary"
              class="flex-1"
              type="button"
            />
          </DialogClose>
          <Button
            label="Guardar"
            icon="icon-park-outline:check"
            type="submit"
            class="flex-1"
            :loading="saving"
          />
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'
import { updateLibraryReference } from '~/lib/api/admin/books'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { Field } from '~/components/ui/field'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'

const props = defineProps<{
  bookId: number
  referenceItem: any
}>()

const emit = defineEmits(['confirm'])

const open = ref(false)
const saving = ref(false)

const formSchema = z.object({
  edition: z.string().nonempty('La edición es requerida'),
  location: z.string().nonempty('La ubicación es requerida')
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    edition: props.referenceItem.edition || '',
    location: props.referenceItem.location || ''
  }
})

const onSubmit = handleSubmit(async (values) => {
  saving.value = true
  await updateLibraryReference(props.bookId, props.referenceItem.id, values)
  saving.value = false
  open.value = false
  emit('confirm')
})
</script>
