import { toast } from "vue-sonner"

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
    toast.error('Error al obtener los libros')
    return {
      results: null,
      meta: null,
      error
    }
  }
}

