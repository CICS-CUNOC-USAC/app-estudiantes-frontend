import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

/**
 * Composable reutilizable para filtrado + paginación frontend.
 *
 * @param source  - ref con el array completo de datos
 * @param filterFn - función que recibe (item, query) y retorna boolean
 * @param pageSize - items por página (default 10)
 */
export function useTableSearch<T>(
  source: Ref<T[]>,
  filterFn: (item: T, query: string) => boolean,
  pageSize = 10
) {
  const searchQuery = ref('')
  const currentPage = ref(1)

  const filtered = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return source.value
    return source.value.filter(item => filterFn(item, q))
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filtered.value.length / pageSize))
  )

  const paged = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filtered.value.slice(start, start + pageSize)
  })

  // Resetear página al cambiar filtro
  watch(filtered, () => { currentPage.value = 1 })

  const handleSearch = useDebounceFn((value: string) => {
    searchQuery.value = value
  }, 300)

  const handleClear = () => { searchQuery.value = '' }

  const goToPage = (page: number) => {
    currentPage.value = Math.max(1, Math.min(totalPages.value, page))
  }

  return {
    searchQuery,
    currentPage,
    filtered,
    totalPages,
    paged,
    handleSearch,
    handleClear,
    goToPage,
  }
}