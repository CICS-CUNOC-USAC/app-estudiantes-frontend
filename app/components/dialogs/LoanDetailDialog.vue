<template>
  <Dialog
    @update:open="
      (open) => {
        if (open) execute()
      }
    "
  >
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="flex flex-row pr-4 items-start justify-between gap-x-4">
        <DialogTitle>Información del Prestamo</DialogTitle>
        <div class="flex items-center gap-2">
          <Button
            v-if="!isReturned"
            icon="lucide:printer"
            variant="text"
            :loading="printing"
            @click="handlePrint"
            title="Imprimir recibo"
          />
          <Button
            v-else
            icon="lucide:printer"
            variant="text"
            :loading="printing"
            @click="handleReturnedPrint"
            title="Imprimir recibo de retorno"
          />
        </div>
      </DialogHeader>

      <div class="h-full">
        <div class="space-y-2" v-if="data">
          <p class="text-gray-600 dark:text-gray-400">
            <span class="font-medium"
              >Prestado:
              <strong>{{
                new Date(loanItem.created_at).toLocaleString()
              }}</strong></span
            >
          </p>

          <p v-if="isReturned" class="text-gray-600 dark:text-gray-400">
            <span class="font-medium"
              >Retornado:
              <strong>{{
                new Date(loanItem.returned_at).toLocaleString()
              }}</strong></span
            >
          </p>

          <p
            v-if="isReturned"
            class="text-lg font-semibold text-green-600 dark:text-green-400"
          >
            Retornado · {{ totalDaysLoaned() }} dia/s
          </p>
          <p v-else class="text-gray-600 dark:text-gray-400">
            <span class="font-medium">{{
              daysLoan() > 0
                ? `Hace ${daysLoan()}
                dia/s`
                : 'Hoy'
            }}</span>
          </p>

          <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ data.name }}
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            <span class="font-medium">Autor:</span> {{ data.author }}
          </p>

          <p class="text-gray-600 dark:text-gray-400">
            <span class="font-medium"
              >{{
                (loanItem.ra?.length ?? 0 > 0)
                  ? 'Registro Academico'
                  : 'Identificacion Personal'
              }}:</span
            >
            {{
              (loanItem.ra?.length ?? 0 > 0)
                ? loanItem.ra
                : loanItem.personal_id
            }}
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            En <strong>{{ loanItem.place }}</strong>
          </p>
          <Separator />
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
  </Dialog>
</template>
<script setup lang="ts">
import { toast } from 'vue-sonner'
import { getBookById } from '~/lib/api/books'
import Button from '~/components/ui/button/Button.vue'
import type { Loan } from '~/lib/api/admin/loans'
import Separator from '../ui/separator/Separator.vue'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger
} from '../ui/dialog'

const { loanItem } = defineProps<{
  title: string
  loanItem: Loan
  showAllInfo?: boolean
}>()

const isReturned = computed(() => !!loanItem.returned_at)

const { data, status, execute } = await useAsyncData<Book>(
  () => getBookById(loanItem.library_reference.book_id),
  {
    immediate: false
  }
)

const printing = ref(false)

const handlePrint = async () => {
  printing.value = true
  let iframe: HTMLIFrameElement | null = null

  const cleanup = () => {
    if (iframe && iframe.parentNode) {
      document.body.removeChild(iframe)
    }
    printing.value = false
  }

  try {
    const response = await $api<string>(
      `/print/external-loan-receipt/${loanItem.id}`
    )

    // Create blob URL instead of using document.write
    const blob = new Blob([response], { type: 'text/html' })
    const blobUrl = URL.createObjectURL(blob)

    iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    // Load content via src instead of document.write
    iframe.src = blobUrl

    iframe.onload = () => {
      try {
        iframe!.contentWindow?.print()

        // Cleanup after print dialog closes or after a reasonable timeout
        if (iframe!.contentWindow?.matchMedia) {
          const afterPrint = iframe!.contentWindow.matchMedia('print')
          afterPrint.addEventListener('change', (e) => {
            if (!e.matches) {
              URL.revokeObjectURL(blobUrl)
              cleanup()
            }
          })
        }

        // Fallback cleanup after 30 seconds
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl)
          cleanup()
        }, 30000)
      } catch (printError) {
        URL.revokeObjectURL(blobUrl)
        cleanup()
        toast.error('Error al imprimir')
      }
    }

    iframe.onerror = () => {
      URL.revokeObjectURL(blobUrl)
      cleanup()
      toast.error('Error al cargar el documento')
    }
  } catch (error) {
    cleanup()
    toast.error('Error al imprimir')
  }
}

const handleReturnedPrint = async () => {
  printing.value = true
  let iframe: HTMLIFrameElement | null = null

  const cleanup = () => {
    if (iframe && iframe.parentNode) {
      document.body.removeChild(iframe)
    }
    printing.value = false
  }

  try {
    const response = await $api<string>(
      `/print/returned-loan-receipt/${loanItem.id}`
    )

    const blob = new Blob([response], { type: 'text/html' })
    const blobUrl = URL.createObjectURL(blob)

    iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    iframe.src = blobUrl

    iframe.onload = () => {
      try {
        iframe!.contentWindow?.print()

        if (iframe!.contentWindow?.matchMedia) {
          const afterPrint = iframe!.contentWindow.matchMedia('print')
          afterPrint.addEventListener('change', (e) => {
            if (!e.matches) {
              URL.revokeObjectURL(blobUrl)
              cleanup()
            }
          })
        }

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl)
          cleanup()
        }, 30000)
      } catch (printError) {
        URL.revokeObjectURL(blobUrl)
        cleanup()
        toast.error('Error al imprimir')
      }
    }

    iframe.onerror = () => {
      URL.revokeObjectURL(blobUrl)
      cleanup()
      toast.error('Error al cargar el documento')
    }
  } catch (error) {
    cleanup()
    toast.error('Error al imprimir')
  }
}

const daysLoan = () => {
  const today = new Date()
  const loanDate = new Date(loanItem.created_at)

  today.setHours(0, 0, 0, 0)
  loanDate.setHours(0, 0, 0, 0)

  const differenceInMs = Math.abs(loanDate.getTime() - today.getTime())

  const millisecondsInADay = 1000 * 60 * 60 * 24

  const daysDifference = Math.ceil(differenceInMs / millisecondsInADay)

  return daysDifference
}

const totalDaysLoaned = () => {
  const loanDate = new Date(loanItem.created_at)
  const returnDate = new Date(loanItem.returned_at!)

  loanDate.setHours(0, 0, 0, 0)
  returnDate.setHours(0, 0, 0, 0)

  const differenceInMs = Math.abs(returnDate.getTime() - loanDate.getTime())

  const millisecondsInADay = 1000 * 60 * 60 * 24

  const daysDifference = Math.ceil(differenceInMs / millisecondsInADay)

  return daysDifference
}
</script>
<style scoped></style>
