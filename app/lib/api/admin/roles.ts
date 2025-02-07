export async function getAllRoles(params?: {}) {
  const results = await $api<Role[]>(`/roles`, {
    params
  })
  return {
    results
  }
}