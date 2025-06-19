import { toast } from 'vue-sonner'
import type { Media } from '~/lib/api/books';
import type { Metadata } from '~/utils/types/fetching'

export interface Book {
  id:                number;
  name:              string;
  isbn:              string;
  description:       string;
  file:              null;
  source_url:        null;
  media_id:          null;
  created_at:        Date;
  updated_at:        Date;
  author:            string;
  category_id:       number;
  media?:            Media;
  library_reference: LibraryReference;
}

export interface LibraryReference {
  id:                   string;
  book_id:              number;
  total_availability:   number;
  is_available:         boolean;
  edition:              string;
  location:             string;
  created_at:           Date;
  updated_at:           Date;
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
  isbn?: string
  reference_id?: string
  total_availability?: number
  current_availability?: number
  edition?: string
  location?: string
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
      return {
        results,
        meta
      }
    } catch (error) {
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
      toast.success('Recurso creado', {description: 'Libro creado correctamente' })
      return response
    } catch (error) {
      toast.error('Error al crear el recurso', {description: (error as any).data.message ?? (error as any).data.error })
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
      toast.success('Recurso actualizado', {description: 'Libro actualizado correctamente' })
      return response
    } catch (error) {
      toast.error('Error al crear el recurso', {description: (error as any).data.message ?? (error as any).data.error })
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
      toast.success('Recurso eliminado', {description: 'Libro eliminado correctamente' })
      await fetchAllBooks()
      return response
    } catch (error) {
      toast.error('Error al eliminar el recurso', {description: (error as any).data.message ?? (error as any).data.error })
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
