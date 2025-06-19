<template>
  <DialogRoot
    @update:open="
      (open) => {
        if (open) execute()
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
          <span class="text-xl font-semibold"> Información del libro </span>
          <DialogClose
            class="cursor-pointer rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <Icon name="lucide:x" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </DialogTitle>
        <div class="h-full">
          <div class="space-y-2" v-if="data">
            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ data.name }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              <span class="font-medium">Autor:</span> {{ data.author }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              <span class="font-medium">ISBN:</span> {{ data.isbn }}
            </p>
            <p
              class="text-gray-600 dark:text-gray-400"
              v-if="data.library_reference"
            >
              <span class="font-medium">Edición:</span>
              {{ data.library_reference.edition }}
            </p>

            <!-- Description -->
            <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {{ data.description }}
            </p>
            <!-- {{ data.media?.url }} -->

            <div class="flex items-center gap-4">
              <CButton
                v-if="data.media?.url"
                class="mb-4"
                :href="data.media.url"
                target="_blank"
                variant="tonal"
                block
                label="Ver archivo adjunto"
                icon="icon-park-twotone:book-open"
              />

              <CButton
                v-if="data.source_url"
                class="mb-4 block"
                :href="data.source_url"
                target="_blank"
                variant="link"
                label="Más información"
                icon="icon-park-outline:right-small-up"
              />
            </div>
            <p
              v-if="!showAllInfo && data.library_reference"
              class="dark:text-gray-400"
              :class="
                data.library_reference.is_available
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              {{
                data.library_reference.is_available
                  ? 'Disponible en biblioteca'
                  : 'No disponible'
              }}
            </p>

            <template v-else>
              <div class="dark:text-gray-400" v-if="data.library_reference">
                <h6>
                  <span class="text-muted-color">Disponibilidad: </span>
                  <strong
                    :class="data.library_reference.is_available ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ data.library_reference.is_available ? 'Disponible' : 'No Disponible' }}
                  </strong>
                </h6>
              </div>
            </template>
            <template v-if="showAllInfo && data.library_reference">
              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-medium">Identificador en biblioteca:</span>
                {{ data.library_reference.id }}
              </p>

              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-medium">Ubicación:</span>
                {{ data.library_reference.location }}
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

const { bookItem } = defineProps<{
  title: string
  bookItem: Book
  showAllInfo?: boolean
}>()

const { data, status, execute } = await useAsyncData<Book>(
  () => getBookById(bookItem.id),
  {
    immediate: false
  }
)
</script>
<style scoped></style>
