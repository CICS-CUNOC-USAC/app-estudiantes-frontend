export function strapiGroupsClient() {
  const config = useRuntimeConfig()
  return $fetch.create({
    baseURL: `${config.strapiUrl}/${config.strapiPrefix}`,
    headers: { Authorization: `Bearer ${config.strapiGruposToken}` },
  })
}
