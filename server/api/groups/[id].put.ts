import { strapiGroupsClient } from "~~/server/utils/strapi-groups-client"
import { verifyStudentSession } from "~~/server/utils/verify-student-session"

export default defineEventHandler(async (event) => {
    const user = verifyStudentSession(event)
    const id = getRouterParam(event, 'id')
    const strapi = strapiGroupsClient()

    const existing: any = await strapi(`/course-groups/${id}`)
    if (existing.data.attributes.createdByUserId !== user.id) {
        throw createError({ statusCode: 403, statusMessage: 'No puedes editar este grupo' })
    }

    const body = await readBody(event)
    return strapi(`/course-groups/${id}`, {
        method: 'PUT',
        body: {
            data: {
                courseCode: body.courseCode,
                section: body.section,
                platform: body.plataforma,
                link: body.link,
                type: body.type,
                academicPeriod: body.academicPeriod,
                visibility: body.visibility,
                alternativeContact: body.alternativeContact,
                contactNotes: body.contactNotes,
                lecturer: null,
            }
        },
    })
})