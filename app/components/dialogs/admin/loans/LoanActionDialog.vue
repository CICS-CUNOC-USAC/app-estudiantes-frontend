<template>
  <CDialog v-model:open="open" @update:open="(open)=> {
    clear()
  }">
    <CDialogTrigger as-child>
      <slot />
    </CDialogTrigger>
    <CDialogContent title="¿Deseas retornar este prestamo?">
      Retornar el libro <strong>{{ bookName }}</strong> con referencia <strong>{{ bookReferenceId }}</strong>.
      <p class="text-red-600 mt-4">
        Esta accion no se puede revertir
      </p>
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
      loan: false,
      external: true,
      data: {
        place: placeValue.value,
        loan_id: props.loan_id,
      }
    })
  },
  onSuccess: () => {
    toast.success('Prestamo retornado exitosamente')
    open.value = false
    emit('confirm')
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
  bookReferenceId: string
  loan_id: number
}>()

const emit = defineEmits(['confirm'])
</script>
<style scoped></style>
