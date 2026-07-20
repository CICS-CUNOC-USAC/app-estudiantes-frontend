import { strapiGroupsClient } from "~~/server/utils/strapi-groups-client"
import { diceCoefficient, normalize } from "~~/server/utils/text-similarity"
import { verifyStudentSession } from "~~/server/utils/verify-student-session"

export default defineEventHandler(async (event) => {
    verifyStudentSession(event)
    const query = getQuery(event)
    const strapi = strapiGroupsClient()

    const candidates: any = await strapi('/course-groups', {
        query: {
            filters: {
                courseCode: { $eq: query.courseCode },
                academicPeriod: { id: { $eq: query.period } },
                active: { $eq: true },
            },
        },
    })

    const requestedSection = normalize(String(query.section ?? ''))
    return candidates.data.map((g: any) => ({
        ...g,
        similarity: diceCoefficient(requestedSection, normalize(g.attributes.section ?? '')),
    })).sort((a: any, b: any) => b.similarity - a.similarity)
})