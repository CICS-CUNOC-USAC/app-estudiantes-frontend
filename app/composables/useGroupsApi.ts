import type { CourseGroup } from "~/lib/api/strapi/types"

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
        list: (filters?: Record<string, any>): Promise<CourseGroup[]> =>
            api<CourseGroup[]>('/', { query: filters }),

        get: (id: string): Promise<CourseGroup> =>
            api<CourseGroup>(`/${id}`),

        create: (data: Partial<CourseGroup>): Promise<CourseGroup> =>
            api<CourseGroup>('/', {
                method: 'POST',
                body: data,
            }),

        update: (id: string, data: Partial<CourseGroup>): Promise<CourseGroup> =>
            api<CourseGroup>(`/${id}`, {
                method: 'PUT',
                body: data,
            }),

        remove: (id: string): Promise<void> =>
            api<void>(`/${id}`, {
                method: 'DELETE',
            }),

        duplicates: (params: Record<string, any>): Promise<any> =>
            api('/duplicates', {
                query: params,
            }),
    }
}