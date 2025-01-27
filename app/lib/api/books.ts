export async function fetchAllBooks(params?: {})  {
  try {
    const response = await $api<BooksResponse>('/library', {
      params
    })
    const { results, ...meta } = response
    return {
      results,
      meta,
      error: null
    }
  } catch (error) {
    useSnackbarStore().showSnackbar({
      title: 'Error al obtener los libros',
      message: (error as any).data.message ?? (error as any).data.error,
      type: SnackbarType.ERROR
    })
    return {
      results: null,
      meta: null,
      error
    }
  }
}