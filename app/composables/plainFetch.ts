const _$apiFetch = $fetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  onRequest: ({ options }) => {
    const token = useCookie('cicsapp-user-token')
    if (token.value) {
      options.headers.set('Authorization', `Bearer ${token.value}`)
    }
  },
})

async function doRefresh(): Promise<void> {
  const refreshCookie = useCookie('cicsapp-refresh-token')
  const roleCookie = useCookie('cicsapp-roleuser')
  if (!refreshCookie.value) throw new Error('No refresh token')

  const endpoint =
    roleCookie.value === 'staff' ? '/staff-auth/refresh' : '/auth/refresh'
  const result = await $fetch<{ access_token: string; refresh_token: string }>(
    endpoint,
    {
      baseURL: import.meta.env.VITE_API_BASE_URL,
      method: 'POST',
      body: { refresh_token: refreshCookie.value },
    },
  )

  useCookie('cicsapp-user-token').value = result.access_token
  useCookie('cicsapp-refresh-token', { maxAge: 2592000 }).value =
    result.refresh_token

  const { useAuthStore } = await import('~/stores/auth')
  useAuthStore().token = result.access_token
}

export const $api = async <T>(
  request: string,
  opts?: Parameters<typeof _$apiFetch>[1],
): Promise<T> => {
  try {
    return (await _$apiFetch<T>(request, opts)) as T
  } catch (err: any) {
    if (err?.status !== 401) throw err

    // Only attempt refresh if there is a stored refresh token.
    // Without this guard a failed login (wrong password → 401) would
    // incorrectly trigger logout and redirect to home.
    const refreshCookie = useCookie('cicsapp-refresh-token')
    if (!refreshCookie.value) throw err

    try {
      await doRefresh()
      return (await _$apiFetch<T>(request, opts)) as T
    } catch {
      const { useAuthStore } = await import('~/stores/auth')
      useAuthStore().logout()
      throw err
    }
  }
}
