import { toast } from "vue-sonner"

export async function fetchAllBooks(params?: {})  {
  try {
    const response = await $api<BooksResponse>('/library/admin', {
      params
    })
    const { results, ...meta } = response
    return {
      results,
      meta,
      error: null
    }
  } catch (error) {
    toast.error('Error al obtener los libros')
    return {
      results: null,
      meta: null,
      error
    }
  }
}

export async function deleteBook(id: string) {
  try {
    await $api(`/library/admin/${+id}`, {
      method: 'DELETE'
    })
    toast.success('Libro eliminado correctamente')
    return null
  } catch (error) {
    toast.error('Error al eliminar el libro')
    return error
  }
  
}