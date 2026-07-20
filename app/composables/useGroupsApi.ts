export function useCourseGroupsApi() {
    const tokenCookie = useCookie('cicsapp-user-token')

    const api = $fetch.create({
        baseURL: '/estudiantes/api/groups',

        onRequest({ options }) {
            if (tokenCookie.value) {
                options.headers.set(
                    'Authorization',
                    `Bearer ${tokenCookie.value}`
                )
            }
        },
    })

    return {
        list: (filters: Record<string, any>) =>
            api('/', { query: filters }),

        get: (id: string) =>
            api(`/${id}`),

        create: (data: any) =>
            api('/', {
                method: 'POST',
                body: data,
            }),

        update: (id: string, data: any) =>
            api(`/${id}`, {
                method: 'PUT',
                body: data,
            }),

        remove: (id: string) =>
            api(`/${id}`, {
                method: 'DELETE',
            }),

        duplicates: (params: Record<string, any>) =>
            api('/duplicados', {
                query: params,
            }),
    }
}