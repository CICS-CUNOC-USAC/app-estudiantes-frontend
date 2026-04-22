export async function getAllRoles(params?: {}) {
  const results = await $api<Role[]>(`/roles`, {
    params
  })
  return {
    results
  }
}

export async function fetchRole(id: string | number) {
  const result = await $api<Role>(`/roles/${id}`)
  return {
    result
  }
}

export async function createRole (payload: Role) {
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