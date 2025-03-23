// import type { NitroFetchRequest } from 'nitropack'

// export function $api<
//   T = unknown,
//   R extends NitroFetchRequest = NitroFetchRequest
// >(
//   request: Parameters<typeof $fetch<T, R>>[0],
//   opts?: Partial<Parameters<typeof $fetch<T, R>>[1]>
// ) {
//   const userAuth = useCookie('cicsapp-user-token')
//   const authHeader = {
//     Authorization: userAuth.value ? `Bearer ${userAuth.value}` : ''
//   }
//   const { headers, ...allOpts } = opts || {}

//   return $fetch<T, R>(request, {
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     headers: {
//       ...authHeader,
//       ...headers
//     },
//     ...allOpts
//   })
// }

export const $api = $fetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  onRequest: ({
    options
  }) => {
    const userAuth = useCookie('cicsapp-user-token')
    
    if (userAuth.value) {
      options.headers.set('Authorization', `Bearer ${userAuth.value}`)
    }
  },
})


