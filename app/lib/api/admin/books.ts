import { toast } from 'vue-sonner'

export interface Category {
  id: number
  name: string
  description: string
  created_at: Date
  updated_at: Date
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
  category_id?: number
  is_available?: boolean
}

export const fetchAllBooks = async (
  params: any,
  type: 'digital' | 'physical'
) => {
  try {
    const response = await $api<BooksResponse>(`/books/${type}`, {
      params
    })
    const { results, ...meta } = response
    return {
      results,
      meta
    }
  } catch (error) {
    toast.error('Error al obtener los libros', {
      description: (error as any).data.message ?? (error as any).data.error
    })
  }
}

export const createWithoutMedia = async (
  payload: BookPayload,
  type: 'digital' | 'physical'
) => {
  console.log('payload', payload)
  try {
    const response = await $api<Book>(`/books/${type}`, {
      method: 'POST',
      body: payload
    })
    toast.success('Recurso creado', {
      description: 'Libro creado correctamente'
    })
    return response
  } catch (error) {
    toast.error('Error al crear el libro', {
      description: (error as any).data.message ?? (error as any).data.error
    })
    return {
      error
    }
  }
}

export const createBookItem = async (
  payload: BookPayload,
  type: 'digital' | 'physical'
) => {
  try {
    const uploadedMedia = await useMediaStore().postMedia({
      file: payload.file,
      path: 'library',
      attach_type: 'library'
    })
    const response = await $api<Book>(`/books/${type}`, {
      method: 'POST',
      body: {
        ...payload,
        media_id: uploadedMedia?.id
      }
    })
    toast.success('Recurso creado', {
      description: 'Libro creado correctamente'
    })
    return response
  } catch (error) {
    toast.error('Error al crear el libro', {
      description: (error as any).data.message ?? (error as any).data.error
    })
    return {
      error
    }
  }
}

export async function deleteBook(id: string | number) {
  try {
    await $api(`/books/admin/${id}`, {
      method: 'DELETE'
    })
    toast.success('Libro eliminado correctamente')
    return null
  } catch (error) {
    toast.error('Error al eliminar el libro')
    return error
  }
}

export const updateBook = async (
  id: number | string,
  payload: Partial<BookPayload>
) => {
  try {
    const response = await $api<Book>(`/books/admin/${id}`, {
      method: 'PATCH',
      body: payload
    })
    toast.success('Libro actualizado', {
      description: 'Libro actualizado correctamente'
    })
    return response
  } catch (error) {
    toast.error('Error al actualizar el libro', {
      description: (error as any).data.message ?? (error as any).data.error
    })
    return { error }
  }
}

export const updateLibraryReference = async (
  bookId: number | string,
  referenceId: number | string,
  payload: { edition?: string; location?: string }
) => {
  try {
    await $api(`/books/admin/${bookId}/${referenceId}`, {
      method: 'PATCH',
      body: payload
    })
    toast.success('Referencia actualizada', {
      description: 'Referencia actualizada correctamente'
    })
  } catch (error) {
    toast.error('Error al actualizar la referencia', {
      description: (error as any).data.message ?? (error as any).data.error
    })
    return { error }
  }
}

export async function loanOrReturn({
  bookReferenceId,
  loan,
  external,
  data
}: {
  bookReferenceId: string
  loan: boolean
  external: boolean
  data: {
    ra?: string | null
    personal_id?: string
    loan_id?: number
    place: string
  }
}) {
  const actionType = loan
    ? external
      ? 'external-loan'
      : 'simple-loan'
    : external
      ? 'external-return'
      : 'simple-return'

  const endpoint = `/loans/${actionType}/${bookReferenceId}`

  if (actionType == 'external-return') {
    return await $api(endpoint, {
      method: 'POST',
      body: { loan_id: data.loan_id, bookReferenceId }
    })
  } else {
    return await $api(endpoint, {
      method: 'POST',
      body: data
    })
  }
}

export async function getAllCategories(params?: {}) {
  const results = await $api<Category[]>(`/categories`, {
    params
  })
  return {
    results
  }
}
