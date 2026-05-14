import { ref, computed } from 'vue'

/**
 * Composable para el buscador tipo autocomplete dentro de un modal.
 * Maneja: query, lista filtrada, item seleccionado, seleccionar y limpiar.
 *
 * @param source   - ref con el array completo de opciones
 * @param filterFn - (item, query) => boolean
 * @param limit    - máximo de resultados visibles (default 8)
 */
export function useModalSearch<T>(
  source: Ref<T[]>,
  filterFn: (item: T, query: string) => boolean,
  limit = 8
) {
  const query = ref('')
  const selected = ref<T | null>(null)

  const results = computed(() => {
    const q = query.value.trim().toLowerCase()
    const list = q
      ? source.value.filter(item => filterFn(item, q))
      : source.value
    return list.slice(0, limit)
  })

  const select = (item: T) => {
    selected.value = item
    query.value = ''
  }

  const clear = () => {
    selected.value = null
    query.value = ''
  }

  const reset = () => {
    selected.value = null
    query.value = ''
  }

  return { query, selected, results, select, clear, reset }
}