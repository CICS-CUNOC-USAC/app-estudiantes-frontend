<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="">
      <DialogHeader>
        <DialogTitle>Información del libro</DialogTitle>
      </DialogHeader>

      <div v-if="data" class="space-y-2">
        <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ data.name }}
        </p>
        <p class="text-gray-600 dark:text-gray-400">
          <span class="font-medium">Autor:</span> {{ data.author }}
        </p>
        <p class="text-gray-600 dark:text-gray-400">
          <span class="font-medium">ISBN:</span> {{ data.isbn }}
        </p>
        <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {{ data.description }}
        </p>

        <div class="flex items-center gap-4">
          <Button
            v-if="data.media?.url"
            class="mb-4"
            :href="data.media.url"
            target="_blank"
            variant="tonal"
            block
            label="Ver archivo adjunto"
            icon="icon-park-twotone:book-open"
          />
          <Button
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
          v-if="!showAllInfo && !data.media"
          class="dark:text-gray-400"
          :class="(data.totalAvailable ?? 0) > 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ (data.totalAvailable ?? 0) > 0 ? 'Disponible en biblioteca' : 'No disponible' }}
        </p>

        <template v-else>
          <div class="dark:text-gray-400" v-if="data.library_reference">
            <div class="flex flex-row gap-x-4">
              <h6>
                <span class="text-muted-foreground">Disponibilidad: </span>
                <strong
                  :class="data.library_reference.filter((ref: any) => ref.is_available).length ? 'text-green-600' : 'text-red-600'"
                >
                  {{ data.library_reference.filter((ref: any) => ref.is_available).length ? 'Disponible' : 'No Disponible' }}
                </strong>
              </h6>
              <h6>
                <span class="text-muted-foreground">Existencias: </span>
                <strong>{{ data.library_reference.length }}</strong>
              </h6>
              <div class="mb-2 flex justify-end">
                <LibraryReferenceCreateDialog :book-id="bookItem.id" @confirm="refresh">
                  <Button
                    icon="icon-park-outline:plus"
                    size="small"
                    label="Agregar existencia"
                    variant="tonal"
                  />
                </LibraryReferenceCreateDialog>
              </div>
            </div>
          </div>
        </template>

        <template v-if="showAllInfo && data.library_reference">
          <DataTable
            :columns
            :data="paginatedReferences"
            :total-elements="totalReferences"
            :total-pages="totalReferencePages"
            :pagination-state="referencesPagination"
            :enable-sorting="false"
            disable-column-visibility
            disable-pagination
            @pagination-change="
              ($event) => {
                if (typeof $event === 'function') {
                  referencesPagination = $event(referencesPagination)
                } else {
                  referencesPagination = { ...referencesPagination, ...$event }
                }
              }
            "
          />
        </template>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="tsx">
import { computed, ref, watch } from 'vue'
import { getAdminBookByIdAndType, getBookById } from '~/lib/api/books'
import type { LibraryReference } from '~/stores/admin-library'
import Button from '~/components/ui/button/Button.vue'
import KebabMenu from '../partials/KebabMenu.vue'
import BookActionDialog from './admin/books/BookActionDialog.vue'
import LibraryReferenceEditDialog from './admin/books/LibraryReferenceEditDialog.vue'
import LibraryReferenceCreateDialog from './admin/books/LibraryReferenceCreateDialog.vue'
import LibraryReferenceDeleteDialog from './admin/books/LibraryReferenceDeleteDialog.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'

const props = defineProps<{
  bookItem: any
  showAllInfo?: boolean
}>()

const open = ref(false)

const { data, refresh } = await useAsyncData<Book>(
  `book-detail-${props.bookItem.id}`,
  () =>
    props.showAllInfo
      ? getAdminBookByIdAndType(props.bookItem.id, 'physical')
      : getBookById(props.bookItem.id),
  { immediate: true }
)

const referencesPagination = ref({
  pageIndex: 0,
  pageSize: 5
})

const totalReferences = computed(() => data.value?.library_reference?.length ?? 0)

const totalReferencePages = computed(() =>
  Math.max(1, Math.ceil(totalReferences.value / referencesPagination.value.pageSize))
)

const paginatedReferences = computed(() => {
  const references = data.value?.library_reference ?? []
  const start = referencesPagination.value.pageIndex * referencesPagination.value.pageSize
  const end = start + referencesPagination.value.pageSize
  return references.slice(start, end)
})

watch([totalReferences, () => referencesPagination.value.pageSize], () => {
  const maxPage = Math.max(0, totalReferencePages.value - 1)
  if (referencesPagination.value.pageIndex > maxPage) {
    referencesPagination.value = { ...referencesPagination.value, pageIndex: maxPage }
  }
})

const columns: ColumnDef<LibraryReference>[] = [
  {
    accessorKey: 'id',
    meta: { displayName: 'Referencia' },
    header: () => <div class="font-semibold">Referencia</div>,
    cell: ({ row }) => <div>{row.getValue('id')}</div>
  },
  {
    accessorKey: 'location',
    meta: { displayName: 'Ubicación' },
    header: () => <div class="font-semibold">Ubicación</div>,
    cell: ({ row }) => <div>{row.getValue('location')}</div>
  },
  {
    accessorKey: 'is_available',
    meta: { displayName: 'Disponibilidad' },
    header: () => <div class="font-semibold">Disponibilidad</div>,
    cell: ({ row }) => (
      <strong class={row.getValue('is_available') ? 'text-green-600' : 'text-red-600'}>
        {row.getValue('is_available') ? 'Disponible' : 'No Disponible'}
      </strong>
    )
  },
  {
    accessorKey: 'edition',
    meta: { displayName: 'Edición' },
    header: () => <div class="font-semibold">Edición</div>,
    cell: ({ row }) => <div>{row.getValue('edition')}</div>
  },
  {
    id: 'actions',
    meta: { displayName: 'Acciones' },
    header: () => <div class="font-semibold">Acciones</div>,
    cell: ({ row }) => (
      <div class="flex flex-col items-center justify-center gap-y-2">
        <BookActionDialog
          bookName={data.value?.name ?? ''}
          bookReferenceId={row.original.id}
          onConfirm={refresh}
        >
          <Button icon="lucide:hand-helping" size="small" label="Prestamo" variant="tonal" />
        </BookActionDialog>
        <KebabMenu>
          <div class="flex flex-col">
            <LibraryReferenceEditDialog
              bookId={props.bookItem.id}
              referenceItem={row.original}
              onConfirm={refresh}
            >
              <button class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800">
                <span>Editar</span>
              </button>
            </LibraryReferenceEditDialog>
            <LibraryReferenceDeleteDialog
              bookId={props.bookItem.id}
              referenceItem={row.original}
              onConfirm={refresh}
            >
              <button class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
                <span>Eliminar</span>
              </button>
            </LibraryReferenceDeleteDialog>
          </div>
        </KebabMenu>
      </div>
    )
  }
]
</script>
