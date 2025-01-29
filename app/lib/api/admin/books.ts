import { toast } from "vue-sonner"

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
    } finally {
      loading.value = false
    }
  }