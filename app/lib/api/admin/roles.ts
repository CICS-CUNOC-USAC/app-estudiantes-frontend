import type { RolePayload } from '~/stores/staff-auth'

export async function getAllRoles(params?: {}) {
  const results = await $api<Role[]>(`/roles`, {
    params
  })
  return {
    results
  }
}

export async function createRole (payload: RolePayload) {
  const result = await $api<Role>(`/roles`, {
    method: 'POST',
    body: payload
  })
  return {
    result
  }
}


export async function updateRole(id: string | number, payload: Role) {
  const result = await $api<Role>(`/roles/${id}`, {
    method: 'PATCH',
    body: payload
  })
  return {
    result
  }
}