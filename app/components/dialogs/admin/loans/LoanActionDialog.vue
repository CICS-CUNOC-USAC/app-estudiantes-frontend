<template>
  <Dialog v-model:open="open" @update:open="(val) => { if (!val) clear() }">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>¿Deseas retornar este prestamo?</DialogTitle>
      </DialogHeader>
      <p>
        Retornar el libro <strong>{{ bookName }}</strong> con referencia
        <strong>{{ bookReferenceId }}</strong>.
      </p>
      <p class="text-red-600">Esta accion no se puede revertir</p>
      <DialogFooter class="mt-4 flex gap-x-4 sm:justify-start">
        <DialogClose as-child>
          <Button
            label="Cancelar"
            severity="secondary"
            icon="icon-park-outline:close"
            class="w-full"
          />
        </DialogClose>
        <Button
          label="Confirmar"
          icon="icon-park-outline:arrow-right"
          class="w-full"
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
import { loanOrReturn } from '~/lib/api/admin/books'

const props = defineProps<{
  bookName: string
  bookReferenceId: string
  loan_id: number
}>()

const emit = defineEmits(['confirm'])

const open = ref(false)

const { mutate, asyncStatus } = useMutation({
  mutation: () => {
    return loanOrReturn({
      bookReferenceId: props.bookReferenceId,
      loan: false,
      external: true,
      data: {
        place: '',
        loan_id: props.loan_id
      }
    })
  },
  onSuccess: () => {
    toast.success('Prestamo retornado exitosamente')
    open.value = false
    emit('confirm')
  },
  onError: (error: any) => {
    toast.error(error.data.message || 'Ha ocurrido un error inesperado')
  }
})

const clear = () => {
  open.value = false
}
</script>
<style scoped></style>
