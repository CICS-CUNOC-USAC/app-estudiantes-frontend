export async function getAllRoles(params?: {}) {
  const results = await $api<Role[]>(`/roles`, {
    params
  })
  return {
    results
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