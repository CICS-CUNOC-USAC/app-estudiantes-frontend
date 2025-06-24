import { toast } from "vue-sonner"

export interface Category {
  id: number
  name: string
  description: string
  created_at: Date
  updated_at: Date
}

export interface Media {
  id:          number;
  filename:    string;
  type:        string;
  size:        string;
  path:        string;
  created_at:  Date;
  updated_at:  Date;
  key:         string;
  attach_type: string;
  dir:         string;
  url:         string;
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
    toast.error('Error al obtener los libros', {
      description: (error as any).data.message ?? (error as any).data.error
    })
  }
}

export async function getBookById(id: number) {
  const result = await $api<Book>(`/books/${id}`)
  return result
}

export async function getAdminBookByIdAndType(id: number, type: 'physical' | 'digital') {
  const result = await $api<Book>(`/books/admin/${id}/${type}`)
  return result
}

export async function getAllCategories(params?: {}) {
  const results = await $api<Category[]>(`/categories`, {
    params
  })
  return {
    results
  }
}
