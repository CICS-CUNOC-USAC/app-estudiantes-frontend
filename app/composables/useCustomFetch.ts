import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'

export function useCustomFetch<T>(
  url: string,
  options: UseFetchOptions<T> = {}
) {
  const userAuth = useCookie('cicsapp-user-token')

  const defaults: UseFetchOptions<T> = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // cache request
    key: url,

    // set user token if connected
    headers: userAuth.value
      ? {
          Authorization: `Bearer ${userAuth.value}`,
          'Content-Type': 'application/json'
        }
      : { 'Content-Type': 'application/json' },

    onResponse(_ctx) {
      // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
    },

    onResponseError(_ctx) {
      // throw new myBusinessError()
    }
  }

  // for nice deep defaults, please use unjs/defu
  const params = defu(options, defaults)

  return useFetch(url, params)
}
