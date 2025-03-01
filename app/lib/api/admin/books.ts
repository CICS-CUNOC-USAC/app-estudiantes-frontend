import { toast } from 'vue-sonner'

export interface Category {
  id: number
  name: string
  description: string
  created_at: Date
  updated_at: Date
}

export interface Loan {
  id: number
  ra?: string
  personal_id: string
  place: string,
  returned_at?: Date,
  created_at: Date
  updated_at: Date
  library_reference: LibraryReference
}

export interface LibraryReference {
  id: string,
  current_availability: number,
  total_availability: number,
  edition: string,
  location: string,
  book: Book
}

export interface Book {
  id: number,
  name: string,
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
    useSnackbarStore().showSnackbar({
      title: 'Error al obtener los libros',
      message: (error as any).data.message ?? (error as any).data.error,
      type: SnackbarType.ERROR
    })
    toast.error('Error al obtener los libros', {
      description: (error as any).data.message ?? (error as any).data.error
    })
  }
}

export const fetchAllLoans = async (
  params: any,
) => {
  try {
    const response = await $api<Loan[]>(`/loans/outstanding-loans`, {
      params
    })
    return response
  } catch (error) {
    useSnackbarStore().showSnackbar({
      title: 'Error al obtener los prestamos',
      message: (error as any).data.message ?? (error as any).data.error,
      type: SnackbarType.ERROR
    })
    toast.error('Error al obtener los prestamos', {
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
    ra?: string
    personal_id?: string
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

  const response = await $api(endpoint, {
    method: 'POST',
    body: data
  })
  return response
}

export async function getAllCategories(params?: {}) {
  const results = await $api<Category[]>(`/categories`, {
    params
  })
  return {
    results
  }
}
