<template>
  <DialogRoot
    @update:open="
      (open) => {
      }
    "
  >
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
            <p class="text-gray-600 dark:text-gray-400">
              <span class="font-medium">Libro:</span> {{ loanInfo.library_reference.book.name }}
            </p>
            <template v-if="loanInfo.ra">
              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-medium">Registro Academico:</span> {{ loanInfo.ra }}
              </p>
            </template>
            <template v-else>
              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-medium">Identificacion Personal:</span> {{ loanInfo.personal_id }}
              </p>
            </template>
            <p
              class="text-gray-600 dark:text-gray-400"
              v-if="loanInfo.library_reference.id"
            >
              <span class="font-medium">Edición:</span>
              {{ loanInfo.library_reference.edition }}
            </p>

            <!-- {{ data.media?.url }} -->

            <p
              v-if="loanInfo.library_reference"
              class="dark:text-gray-400"
              :class="
                loanInfo.library_reference.current_availability > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              {{
                loanInfo.library_reference.current_availability > 0
                  ? 'Disponible en biblioteca'
                  : 'No disponible'
              }}
            </p>

            <template v-if="loanInfo.library_reference">
              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-medium">Ubicación:</span>
                {{ loanInfo.library_reference.location }}
              </p>
            </template>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue';
import type { Loan } from '~/lib/api/admin/books';

const { loanInfo } = defineProps<{
  loanInfo: Loan
}>()
</script>
<style scoped></style>
