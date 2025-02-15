import { toast } from "vue-sonner"

export interface Category {
  id: number
  name: string
  description: string
  created_at: Date
  updated_at: Date
}

export const fetchAllBooks = async (
  params: any,
  type: 'digital' | 'physical'
) => {
  try {
    console.log(`AQUI ESTAMOS`)
    console.log(`/books/public/${type}`)
    const response = await $api<BooksResponse>(`/books/public/${type}`, {
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

export async function getAllCategories(params?: {}) {
  const results = await $api<Category[]>(`/categories`, {
    params
  })
  return {
    results
  }
}