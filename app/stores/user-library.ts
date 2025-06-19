import { toast } from 'vue-sonner'
import type { Metadata } from '~/utils/types/fetching'

export const useUserLibraryStore = defineStore('user-library', () => {
  const loading = ref<boolean>(false)
  const books = ref<Book[] | undefined>(undefined)
  const book = ref<Book | null>(null)
  const responseMeta = ref<Metadata | null>(null)

  const fetchAllBooks = async (params?: {}) => {
    console.log('fetchAllBooks', params)
    loading.value = true
    try {
      const response = await $api<BooksResponse>('/library', {
        params
      })
      const { results, ...meta } = response
      books.value = results
      responseMeta.value = meta
      return response
    } catch (error) {
      toast.error('Error al obtener los libros', {description: (error as any).data.message ?? (error as any).data.error })
      return {
        error
      }
    } finally {
      loading.value = false
    }
  }

  const fetchBookById = (id: number | string) => {
    loading.value = true

    const data = $api<Book>(`/library/${+id}`)

    loading.value = false
    return data
  }

  return {
    loading,
    books,
    book,
    responseMeta,
    fetchAllBooks,
    fetchBookById
  }
})
