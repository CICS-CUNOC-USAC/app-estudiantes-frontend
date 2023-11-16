import type { Metadata } from '~/utils/types/fetching'

export type Book = {
  id: number
  name: string
  description: string
  file: null
  source_url: string
  author: string
  created_at: Date
  updated_at: Date
  media: MediaResponse
}

export type BooksResponse = {
  results: Book[]
  total: number
  limit: number
  page: number
  total_pages: number
}

export type BookPayload = {
  name: string
  author: string
  description?: string
  source_url: string
  file?: File[] | undefined
}

export const useUserLibraryStore = defineStore('user-library', () => {
  const loading = ref<boolean>(false)
  const books = ref<Book[] | undefined>(undefined)
  const book = ref<Book | null>(null)
  const responseMeta = ref<Metadata | null>(null)

  const fetchAllBooks = async (params?: {}) => {
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
      useSnackbarStore().showSnackbar({
        title: 'Error al obtener los libros',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
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
