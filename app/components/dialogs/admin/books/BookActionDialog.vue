<template>
  <CDialog v-model:open="open" @update:open="(open)=> {
    clear()
  }">
    <CDialogTrigger as-child>
      <slot />
    </CDialogTrigger>
    <CDialogContent title="Registrar préstamo o retorno">
      <p>
        Selecciona la acción que deseas realizar con el libro
        <strong>{{ bookName }}</strong>
      </p>
      <PRadioButtonGroup class="mt-3 flex flex-col gap-y-2" v-model="action">
        <label class="flex items-center">
          <PRadioButton name="action" value="lend" />
          <span class="ml-2 font-medium">Préstamo</span>
        </label>

        <label class="flex items-center">
          <PRadioButton name="action" value="return" />
          <span class="ml-2 font-medium">Retorno</span>
        </label>
      </PRadioButtonGroup>
      <label class="mt-4 flex items-center" v-if="action === 'lend'">
        <PCheckbox v-model="external" binary />
        <span class="ml-2 font-medium">Externo</span>
      </label>
      <template v-if="external && action === 'lend'">
        <div class="mt-4">
          <PInputText
            v-model="placeValue"
            label="Lugar de préstamo"
            placeholder="Lugar de préstamo"
          />
        </div>
        <label class="my-4 flex items-center">
          <PToggleSwitch v-model="useRa" />
          <span class="ml-2 font-medium">Usar Registro Académico</span>
        </label>
        <template v-if="action === 'lend'">
          <div class="" v-if="useRa">
            <PInputText
              v-model="raValue"
              label="Registro académico"
              placeholder="Registro académico"
            />
          </div>
          <div class="" v-else>
            <PInputText
              v-model="personalIdValue"
              label="Identificación Personal"
              placeholder="Identificación Personal"
            />
          </div>
        </template>
      </template>
      <div class="mt-4 flex gap-x-4">
        <DialogClose as-child>
          <CButton
            label="Cancelar"
            severity="secondary"
            icon="icon-park-outline:close"
            class="w-full"
          />
        </DialogClose>
        <CButton
          label="Confirmar"
          icon="icon-park-outline:arrow-right"
          class="w-full"
          @click="mutate"
          :loading="asyncStatus === 'loading'"
        />
      </div>
    </CDialogContent>
  </CDialog>
</template>
<script setup lang="ts">
import { toast } from 'vue-sonner'
import CButton from '~/components/primitives/button/CButton.vue'
import {
  CDialog,
  CDialogContent,
  CDialogTrigger
} from '~/components/primitives/dialog'
import { loanOrReturn } from '~/lib/api/admin/books'

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
  },
  onError: (error) => {
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

const props = defineProps<{
  bookName: string
  bookReferenceId: string | number
}>()
</script>
<style scoped></style>
