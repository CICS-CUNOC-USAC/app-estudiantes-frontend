<template>
      <div
        class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100] h-auto max-h-[80vh] w-svw -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 p-6 shadow-lg shadow-black/15 focus:outline-none lg:max-w-xl dark:border-neutral-700 dark:bg-neutral-900">
        <div class="mb-4 flex items-center justify-between">
          <span class="text-xl font-semibold"> Información del libro </span>
          <Button class="cursor-pointer rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800" @click="dialogRef.close()">
            <Icon name="lucide:x" />
            <span class="sr-only">Close</span>
          </Button>
        </div>
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
            <!-- Description -->
            <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {{ data.description }}
            </p>
            <!-- {{ data.media?.url }} -->

            <div class="flex items-center gap-4">
              <CButton v-if="data.media?.url" class="mb-4" :href="data.media.url" target="_blank" variant="tonal" block
                label="Ver archivo adjunto" icon="icon-park-twotone:book-open" />

              <CButton v-if="data.source_url" class="mb-4 block" :href="data.source_url" target="_blank" variant="link"
                label="Más información" icon="icon-park-outline:right-small-up" />
            </div>
            <p v-if="!showAllInfo && !data.media" class="dark:text-gray-400" :class="data.totalAvailable ?? 0 > 0
              ? 'text-green-600'
              : 'text-red-600'
              ">
              {{
              (data.totalAvailable ?? 0) > 0
                  ? 'Disponible en biblioteca'
                  : 'No disponible'
              }}
            </p>

            <template v-else>
              <div class="dark:text-gray-400" v-if="data.library_reference">
                <div class="flex flex-row gap-x-4">
                  <h6>
                    <span class="text-muted-color">Disponibilidad: </span>
                    <strong
                      :class="data.library_reference.filter(ref => ref.is_available).length ? 'text-green-600' : 'text-red-600'">
                      {{data.library_reference.filter(ref => ref.is_available).length ? 'Disponible' : 'No Disponible'
                      }}
                    </strong>
                  </h6>
                  <h6>
                    <span class="text-muted-color">Existencias: </span>
                    <strong>
                      {{ data.library_reference.length }}
                    </strong>
                  </h6>
                </div>
              </div>
            </template>
            <template v-if="showAllInfo && data.library_reference">
              <PDataTable size="small" :value="data.library_reference" :loading="status === 'pending'" :rows="rows"
                :first="first" :total-records="data.library_reference.length" row-hover paginator
                paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink"
                currentPageReportTemplate="{currentPage} de {totalPages}">
                <PColumn field="id" header="Referencia" class="text-center" body-class="w-52">
                </PColumn>
                <PColumn field="location" header="Ubicacion" class="text-center" body-class="w-52">
                </PColumn>
                <PColumn field="is_available" header="Disponibilidad" class="text-center" body-class="truncate max-w-0">
                  <template #body="slotProps">
                    <strong :class="slotProps.data.is_available ? 'text-green-600' : 'text-red-600'">
                      {{ slotProps.data.is_available ? 'Disponible' : 'No Disponible' }}
                    </strong>
                  </template>
                </PColumn>
                <PColumn field="edition" header="Edicion" class="text-center text-sm" body-class="w-60"></PColumn>
                <PColumn field="" header="Acciones" class="w-32 text-center">
                  <template #body="slotProps">
                    <div class="flex flex-col items-center justify-center gap-y-2">
                      <CButton icon="lucide:hand-helping" size="small" label="Prestamo" variant="tonal"
                        @click="openActionDialog(slotProps.data.id)" />
                    </div>
                  </template>
                </PColumn>
              </PDataTable>
            </template>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { useAsyncData } from '#app'
import { useDialog } from 'primevue/usedialog'
import { getAdminBookByIdAndType, getBookById } from '~/lib/api/books'
import CButton from '../primitives/button/CButton.vue'
import BookActionDialog from './admin/books/BookActionDialog.vue'

const dialogRef: any = inject('dialogRef')

const currentPage = ref(0);
const rows = ref(5); 

const first = computed(() => currentPage.value * rows.value);

const { bookItem, showAllInfo } = dialogRef.value.data

const { data, status } = await useAsyncData<Book>(
  `book-detail-${bookItem.id}`,
  () =>
    showAllInfo
      ? getAdminBookByIdAndType(bookItem.id, 'physical')
      : getBookById(bookItem.id),
  { immediate: true }
)

const dialog = useDialog()
function openActionDialog(bookReferenceId: number|string) {
  dialog.open(BookActionDialog, {
    header: 'Registrar préstamo/retorno',
    props: {
      modal: true,
      dismissableMask: true
    },
    data: { bookReferenceId, bookName: data.value?.name }
  })
}
</script>
