<template>
  <Dialog
    v-model:open="open"
    @update:open="
      (val) => {
        if (!val) clear()
      }
    "
  >
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="lg:max-w-xl">
      <DialogHeader>
        <DialogTitle>Registrar préstamo o retorno</DialogTitle>
      </DialogHeader>

      <p>
        Selecciona la acción que deseas realizar con el libro
        <strong>{{ bookName }}</strong>
      </p>

      <RadioGroup
        class="mt-1 flex flex-col gap-y-2"
        :model-value="action"
        @update:model-value="(val) => (action = val as string)"
      >
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="action-lend" value="lend" />
          <Label for="action-lend" class="font-medium">Préstamo</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="action-return" value="return" />
          <Label for="action-return" class="font-medium">Retorno</Label>
        </div>
      </RadioGroup>

      <label
        class="flex items-center gap-x-2 select-none"
        v-if="action === 'lend'"
      >
        <Checkbox id="external" v-model="external" />
        <span class="font-medium">Externo</span>
      </label>

      <template v-if="external && action === 'lend'">
        <CInputText
          v-model="placeValue"
          label="Lugar de préstamo"
          placeholder="Lugar de préstamo"
          no-borders
          prepend-icon="icon-park-twotone:local"
        />

        <label class="flex items-center gap-x-2 select-none">
          <Checkbox id="use-ra" v-model="useRa" />
          <span class="font-medium">Usar Registro Académico</span>
        </label>

        <CInputText
          v-if="useRa"
          v-model="raValue"
          label="Registro académico"
          placeholder="Registro académico"
          no-borders
          prepend-icon="icon-park-twotone:id-card-h"
        />
        <CInputText
          v-else
          v-model="personalIdValue"
          label="Identificación Personal"
          placeholder="Identificación Personal"
          no-borders
          prepend-icon="icon-park-twotone:id-card-h"
        />
      </template>

      <DialogFooter class="mt-2 flex gap-x-4 sm:justify-start">
        <DialogClose as-child>
          <Button
            label="Cancelar"
            severity="secondary"
            icon="icon-park-outline:close"
            class="flex-1"
          />
        </DialogClose>
        <Button
          label="Confirmar"
          icon="icon-park-outline:arrow-right"
          class="flex-1"
          @click="mutate"
          :loading="asyncStatus === 'loading'"
        />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import { toast } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { Checkbox } from '~/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Label } from '~/components/ui/label'
import { loanOrReturn } from '~/lib/api/admin/books'

const props = defineProps<{
  bookName: string
  bookReferenceId: number | string
}>()

const emit = defineEmits(['confirm'])

const open = ref(false)
const action = ref('lend')
const external = ref(false)
const useRa = ref(true)
const raValue = ref('')
const personalIdValue = ref('')
const placeValue = ref('')

const { mutate, asyncStatus } = useMutation({
  mutation: () => {
    return loanOrReturn({
      bookReferenceId: props.bookReferenceId,
      loan: action.value === 'lend',
      external: external.value,
      data: {
        place: placeValue.value,
        ra: raValue.value || null,
        personal_id: personalIdValue.value
      }
    })
  },
  onSuccess: () => {
    toast.success('Operación realizada con éxito')
    open.value = false
    emit('confirm')
  },
  onError: (error: any) => {
    toast.error(error.data.message || 'Ha ocurrido un error inesperado')
  }
})

const clear = () => {
  action.value = 'lend'
  external.value = false
  useRa.value = true
  raValue.value = ''
  personalIdValue.value = ''
  placeValue.value = ''
}
</script>
<style scoped></style>
