import { toast } from "vue-sonner";

export interface Loan {
  id: number;
  ra: string | null;
  personal_id: string;
  place: string;
  library_reference_id: string;
  created_at: Date;
  updated_at: Date;
  returned_at: Date;
  library_reference: LibraryReference
}

export const fetchAllOutstandingLoans = async (
  params: any,
) => {
  try {
    return await $api<Loan[]>(`/loans/outstanding-loans`, {
      params
    })
  } catch (error) {
    toast.error('Error al obtener los prestamos', {
      description: (error as any).data.message ?? (error as any).data.error
    })
  }
}
