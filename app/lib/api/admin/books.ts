import { toast } from 'vue-sonner'

export const fetchAllBooks = async (params: any) => {
  try {
    const response = await $api<BooksResponse>('/books/admin', {
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

export const createBookItem = async (payload: BookPayload, type: 'digital' | 'physical') => {
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

