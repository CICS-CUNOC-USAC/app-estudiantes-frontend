<template>
  <DialogRoot @update:open="
    (open) => {
      if (open) execute()
    }
  ">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="data-[state=open]:animate-overlayShow fixed inset-0 z-30 bg-gray-950/50 transition-all duration-500" />
      <DialogContent
        class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100] h-auto max-h-[80vh] w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 p-6 shadow-lg shadow-black/15 focus:outline-none lg:max-w-xl dark:border-neutral-700 dark:bg-neutral-900">
        <DialogTitle class="mb-4 flex items-center justify-between">
          <span class="text-xl font-semibold"> Información del Prestamo </span>
          <DialogClose class="cursor-pointer rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <Icon name="lucide:x" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </DialogTitle>
        <div class="h-full">
          <div class="space-y-2" v-if="data">
            <p class="text-gray-600 dark:text-gray-400">
              <span class="font-medium">Prestado: <strong>{{ (new
                Date(loanItem.created_at)).toLocaleString() }}</strong> | {{ daysLoan() > 0 ? `Hace ${daysLoan()}
                dia/s` : 'Hoy' }}</span>
            </p>

            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ data.name }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              <span class="font-medium">Autor:</span> {{ data.author }}
            </p>

            <p class="text-gray-600 dark:text-gray-400">
              <span class="font-medium">{{ loanItem.ra?.length ?? 0 > 0 ? 'Registro Academico' : 'Identificacion Personal'
              }}:</span>
              {{ loanItem.ra?.length ?? 0 > 0 ? loanItem.ra : loanItem.personal_id }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              En <strong>{{ loanItem.place }}</strong>
            </p>
            <PDivider />
            <template v-if="showAllInfo && data.library_reference">
              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-medium">Identificador en biblioteca:</span>
                {{ loanItem.library_reference.id }}
              </p>

              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-medium">Ubicación:</span>
                {{ loanItem.library_reference.location }}
              </p>
            </template>

          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
<script setup lang="ts">
import { getBookById } from '~/lib/api/books'
import CButton from '../primitives/button/CButton.vue'
import type { Loan } from '~/lib/api/admin/loans';

const { loanItem } = defineProps<{
  title: string
  loanItem: Loan
  showAllInfo?: boolean
}>()

const { data, status, execute } = await useAsyncData<Book>(
  () => getBookById(loanItem.library_reference.book_id),
  {
    immediate: false
  }
)

const daysLoan = () => {
  const today = new Date();
  const loanDate = new Date(loanItem.created_at);

  today.setHours(0, 0, 0, 0);
  loanDate.setHours(0, 0, 0, 0);

  const differenceInMs = Math.abs(loanDate.getTime() - today.getTime());

  const millisecondsInADay = 1000 * 60 * 60 * 24;

  const daysDifference = Math.ceil(differenceInMs / millisecondsInADay);

  return daysDifference;
}
</script>
<style scoped></style>
