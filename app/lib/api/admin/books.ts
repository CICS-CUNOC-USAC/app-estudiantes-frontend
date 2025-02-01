import { toast } from 'vue-sonner'

const fetchAllBooks = async (params: any) => {
  try {
    const response = await $api<BooksResponse>('/library/admin', {
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

export const createBookItem = async (payload: BookPayload) => {
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
