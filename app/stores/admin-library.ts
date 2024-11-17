import { toast } from 'vue-sonner'
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
  file?: File | undefined
}

export const useAdminLibraryStore = defineStore('admin-library', () => {
  const loading = ref<boolean>(false)
  const books = ref<Book[] | undefined>(undefined)
  const book = ref<Book | null>(null)
  const responseMeta = ref<Metadata | null>(null)

  const fetchAllBooks = async (params: any) => {
    loading.value = true
    try {
      const response = await $api<BooksResponse>('/library/admin', {
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
      toast.error('Error al obtener los libros', {
        description: (error as any).data.message ?? (error as any).data.error
      })
    } finally {
      loading.value = false
    }
  }

  const fetchBookById = (id: number | string) => {
    loading.value = true

    const data = $api<Book>(`/library/admin/${+id}`)

    loading.value = false
    return data
  }

  const createBookItem = async (payload: BookPayload) => {
    loading.value = true
    try {
      const uploadedMedia = await useMediaStore().postMedia({
        file: payload.file,
        path: 'library',
        attach_type: 'library'
      })
      const response = await $api<Book>('/library/admin', {
        method: 'POST',
        body: {
          ...payload,
          media_id: uploadedMedia?.id
        }
      })
      useSnackbarStore().showSnackbar({
        title: 'Recurso creado',
        message: 'Lirbo creado correctamente',
        type: SnackbarType.SUCCESS
      })
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al crear el recurso',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    } finally {
      loading.value = false
    }
  }

  const updateBookItem = async (
    id: number | string,
    payload: Partial<BookPayload>
  ) => {
    try {
      const response = await $api<Book>(`/library/admin/${+id}`, {
        method: 'PATCH',
        body: payload
      })
      useSnackbarStore().showSnackbar({
        title: 'Recurso actualizado',
        message: 'Libro actualizado correctamente',
        type: SnackbarType.SUCCESS
      })
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al crear el recurso',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    } finally {
      loading.value = false
    }
  }

  const deleteBookItem = async (id: number | string) => {
    loading.value = true
    try {
      const response = await $api<Book>(`/library/admin/${+id}`, {
        method: 'DELETE'
      })
      useSnackbarStore().showSnackbar({
        title: 'Recurso eliminado',
        message: 'Libro eliminado correctamente',
        type: SnackbarType.SUCCESS
      })
      await fetchAllBooks()
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al eliminar el recurso',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    books,
    book,
    responseMeta,
    fetchAllBooks,
    fetchBookById,
    createBookItem,
    updateBookItem,
    deleteBookItem
  }
})
