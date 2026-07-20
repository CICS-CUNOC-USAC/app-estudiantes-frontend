import { strapiGroupsClient } from "~~/server/utils/strapi-groups-client"
import { verifyStudentSession } from "~~/server/utils/verify-student-session"

export default defineEventHandler(async (event) => {
  verifyStudentSession(event)
  const query = getQuery(event)
  const strapi = strapiGroupsClient()

  const filters: Record<string, any> = { active: { $eq: true } }
  if (query.courseCode) filters.courseCode = { $eq: query.courseCode }
  if (query.type) filters.type = { id: { $eq: query.type } }
  if (query.period) filters.academicPeriod = { id: { $eq: query.period } }

  return strapi('/course-groups', {
    query: { filters, populate: ['type', 'academicPeriod', 'lecturer'] },
  })
})