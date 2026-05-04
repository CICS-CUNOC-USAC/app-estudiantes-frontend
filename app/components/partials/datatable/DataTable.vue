<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  SortingState,
  VisibilityState
} from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import Button from '~/components/ui/button/Button.vue'
import DropdownMenu from '~/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '~/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '~/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuCheckboxItem from '~/components/ui/dropdown-menu/DropdownMenuCheckboxItem.vue'

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    totalElements?: number
    totalPages?: number
    sorting?: SortingState
    enableSorting?: boolean
    disablePagination?: boolean
    disableColumnVisibility?: boolean
    tableKeyName?: string
    paginationState?: {
      pageIndex: number
      pageSize: number
    }
  }>(),
  {
    paginationState: () => ({
      pageIndex: 0,
      pageSize: 10
    }),
    sorting: () => [],
    enableSorting: true,
    disableColumnVisibility: false
  }
)

const emit = defineEmits(['paginationChange', 'sortChange'])

// Initialize column visibility with localStorage persistence
const getStorageKey = () =>
  props.tableKeyName ? `datatable_columns_${props.tableKeyName}` : null

// Function to load column visibility from localStorage
const loadColumnVisibility = (): VisibilityState => {
  const storageKey = getStorageKey()
  if (!storageKey || process.env.NODE_ENV === 'server') {
    return {}
  }

  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.warn('Failed to parse stored column visibility:', error)
    return {}
  }
}

// Function to save column visibility to localStorage
const saveColumnVisibility = (visibility: VisibilityState) => {
  const storageKey = getStorageKey()
  if (!storageKey || process.env.NODE_ENV === 'server') {
    return
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(visibility))
  } catch (error) {
    console.warn('Failed to save column visibility:', error)
  }
}

const columnVisibility = ref<VisibilityState>({})

// Load initial column visibility on client side
onMounted(() => {
  if (props.tableKeyName) {
    columnVisibility.value = loadColumnVisibility()
  }
})

// Watch for changes and save to localStorage
watch(
  columnVisibility,
  (newVisibility) => {
    if (props.tableKeyName) {
      saveColumnVisibility(newVisibility)
    }
  },
  { deep: true }
)

const table = useVueTable({
  get data() {
    return props.data
  },
  defaultColumn: {
    minSize: 0,
    size: 0
  },
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  enableMultiSort: false,
  manualPagination: true,
  manualSorting: true,
  enableSorting: props.enableSorting,
  get rowCount() {
    return props.totalElements ?? 0
  },
  get pageCount() {
    return props.totalPages ?? -1
  },
  onPaginationChange: (updater) => emit('paginationChange', updater),
  onSortingChange: (updater) => emit('sortChange', updater),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  state: {
    get pagination() {
      return props.paginationState
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get sorting() {
      return props.sorting
    }
  }
})
</script>

<template>
  <div class="min-w-0">
    <div class="flex flex-col items-center justify-between pb-2.5 sm:flex-row">
      <div class="mb-2 sm:mb-0" v-if="!props.disablePagination">
        <span class="text-muted-foreground text-sm">
          Página
          <span class="text-foreground font-bold">{{
            table.getState().pagination.pageIndex + 1
          }}</span>
          de
          {{ table.getPageCount() }}
        </span>
        <span class="font-bold"> ⋅ </span>
        <span class="text-muted-foreground text-sm">
          Total de registros:
          <span class="text-foreground font-semibold">{{
            table.getRowCount()
          }}</span>
        </span>
      </div>

      <div class="flex justify-center gap-2 sm:justify-end">
        <template v-if="!props.disablePagination">
          <Button
            class=""
            @click="table.setPageIndex(0)"
            variant="tonal"
            :disabled="!table.getCanPreviousPage()"
            size="sm"
          >
            <Icon name="lucide:chevrons-left" />
          </Button>
          <Button
            class=""
            @click="table.previousPage()"
            variant="tonal"
            :disabled="!table.getCanPreviousPage()"
            size="sm"
          >
            <Icon name="lucide:chevron-left" />
          </Button>
          <Button
            class=""
            @click="table.nextPage()"
            variant="tonal"
            :disabled="!table.getCanNextPage()"
            size="sm"
          >
            <Icon name="lucide:chevron-right" />
          </Button>
          <Button
            class=""
            @click="table.setPageIndex(table.getPageCount() - 1)"
            variant="tonal"
            :disabled="!table.getCanNextPage()"
            size="sm"
          >
            <Icon name="lucide:chevrons-right" />
          </Button>
        </template>
        <DropdownMenu v-if="!props.disableColumnVisibility">
          <DropdownMenuTrigger as-child>
            <Button variant="tonal" size="sm" class="tracking-normal">
              <Icon
                name="lucide:table-2"
                class="hidden h-4 w-4 max-sm:inline"
              />
              <span class="max-sm:hidden">Columnas</span>
              <Icon name="lucide:chevron-down" class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              v-for="column in table
                .getAllColumns()
                .filter((column) => column.getCanHide())"
              :key="column.id"
              class="capitalize"
              :model-value="column.getIsVisible()"
              @select="
                (e) => {
                  e.preventDefault()
                }
              "
              @update:model-value="
                (value) => {
                  column.toggleVisibility(!!value)
                }
              "
            >
              {{ column.columnDef.meta?.displayName || column.id }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div class="w-full min-w-0 overflow-hidden rounded-xl border border-surface-950/75 dark:border-surface-600/50 max-w-full">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="bg-card py-3"
          >
            <div
              class="flex items-center gap-2 text-base transition"
              :class="{
                'hover:text-foreground select-none':
                  !header.column.getIsSorted(),
                'text-foreground': header.column.getIsSorted(),
                'cursor-pointer': header.column.getCanSort()
              }"
              :style="{
                width:
                  header.getSize() !== 0 ? `${header.getSize()}px` : undefined
              }"
              @click="
                () => {
                  if (header.column.getCanSort()) {
                    header.column.toggleSorting()
                  }
                }
              "
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <Icon
                v-if="header.column.getIsSorted() === 'asc'"
                name="lucide:arrow-up"
                class="ml-1 inline"
              />
              <Icon
                v-else-if="header.column.getIsSorted() === 'desc'"
                name="lucide:arrow-down"
                class="ml-1 inline"
              />
              <!-- you can omit the else-block if you don’t want any icon when unsorted -->
              <Icon
                v-else-if="
                  !header.column.getIsSorted() && header.column.getCanSort()
                "
                name="lucide:chevrons-up-down"
                class="text-muted-foreground ml-1 inline"
              />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="py-3"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              Sin registros disponibles
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
    </div>
  </div>
</template>
