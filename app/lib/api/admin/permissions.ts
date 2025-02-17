export async function getAllPermissions() {
  const results = await $api<Permission[]>(`/permissions`)
  return {
    results
  }
  
}