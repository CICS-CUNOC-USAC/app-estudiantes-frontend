<template>
  <DialogRoot v-model:open="open" @update:open="(open) => {}">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="data-[state=open]:animate-overlayShow fixed inset-0 z-30 bg-gray-950/50 transition-all duration-500"
      />
      <DialogContent
        class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100] h-auto max-h-[80vh] w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 p-6 shadow-lg shadow-black/15 focus:outline-none lg:max-w-xl dark:border-neutral-700 dark:bg-neutral-900"
      >
        <DialogTitle class="mb-4 flex items-center justify-between">
          <span class="text-xl font-semibold"> Información del prestamo </span>
          <DialogClose
            class="cursor-pointer rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <Icon name="lucide:x" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </DialogTitle>
        <div class="h-full">
          <div class="space-y-2">
            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Prestamo #{{ loanInfo.id }}
            </p>
            <h6 class="text-muted-color text-sm font-semibold">
              Registrado a:
            </h6>
            <template v-if="loanInfo.ra">
              <p class="">
                <span class="font-medium">Registro Academico:</span>
                {{ loanInfo.ra }}
              </p>
            </template>
            <template v-else>
              <p class="">
                <span class="font-medium">Identificacion Personal:</span>
                {{ loanInfo.personal_id }}
              </p>
            </template>

            <h6 class="text-muted-color mt-5 text-sm font-semibold">
              Información del libro:
            </h6>

            <p class="">
              <span class="font-medium">Libro:</span>
              {{ loanInfo.library_reference.book.name }} -
              {{ loanInfo.library_reference.id }}
            </p>
            <p class="" v-if="loanInfo.library_reference.id">
              <span class="font-medium">Edición:</span>
              {{ loanInfo.library_reference.edition }}
            </p>

            <p v-if="loanInfo.library_reference" class="">
              <span class="font-medium">Ubicación:</span>
              {{ loanInfo.library_reference.location }}
            </p>
          </div>

          <CButton
            label="Registar Devolución"
            icon="icon-park-outline:arrow-right"
            variant="tonal"
            class="mt-4 w-full"
            @click="mutate"
            :loading="asyncStatus === 'loading'"
          />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
<script setup lang="ts">
import { toast } from 'vue-sonner'
import CButton from '~/components/primitives/button/CButton.vue'
import { loanOrReturn, type Loan } from '~/lib/api/admin/books'

const { loanInfo } = defineProps<{
  loanInfo: Loan
}>()

const open = ref(false)
const emit = defineEmits(['success'])

const { mutate, asyncStatus } = useMutation({
  mutation: () => {
    return loanOrReturn({
      bookReferenceId: loanInfo.library_reference.id,
      loan: false,
      external: true,
      data: {
        loan_id: loanInfo.id,
        library_reference_id: loanInfo.library_reference.id
      }
    })
  },
  onSuccess: () => {
    toast.success('Operación realizada con éxito')
    emit('success')
    open.value = false
  },
  onError: (error) => {
    toast.error(error.data.message || 'Ha ocurrido un error inesperado')
  }
})
</script>
<style scoped></style>
