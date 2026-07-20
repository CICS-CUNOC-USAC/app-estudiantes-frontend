import { strapiGroupsClient } from "~~/server/utils/strapi-groups-client"
import { verifyStudentSession } from "~~/server/utils/verify-student-session"

export default defineEventHandler(async (event) => {
  verifyStudentSession(event)
  const id = getRouterParam(event, 'id')
  return strapiGroupsClient()(`/course-groups/${id}`, {
    query: { populate: ['type', 'academicPeriod', 'lecturer'] },
  })
})
