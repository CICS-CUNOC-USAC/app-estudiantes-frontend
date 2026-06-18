export type PensumField = {
  pensum_id: number
  field_number: number
  name: string
  common_field: boolean
}

export type CreateFieldPayload = {
  fieldNumber: number
  name: string
  commonField: boolean
}

export type UpdateFieldPayload = {
  name?: string
  commonField?: boolean
}

const basePath = (pensumId: number | string) => `/pensums/${pensumId}/fields`

export async function fetchFields(pensumId: number | string) {
  return await $api<PensumField[]>(basePath(pensumId))
}

export async function createField(pensumId: number | string, payload: CreateFieldPayload) {
  return await $api<PensumField>(basePath(pensumId), {
    method: 'POST',
    body: payload
  })
}

export async function updateField(pensumId: number | string, fieldNumber: number, payload: UpdateFieldPayload) {
  return await $api<PensumField>(`${basePath(pensumId)}/${fieldNumber}`, {
    method: 'PATCH',
    body: payload
  })
}

export async function deleteField(pensumId: number | string, fieldNumber: number) {
  await $api(`${basePath(pensumId)}/${fieldNumber}`, { method: 'DELETE' })
}
