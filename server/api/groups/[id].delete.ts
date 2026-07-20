import { strapiGroupsClient } from "~~/server/utils/strapi-groups-client"
import { verifyStudentSession } from "~~/server/utils/verify-student-session"

export default defineEventHandler(async (event) => {
  const user = verifyStudentSession(event)
  const id = getRouterParam(event, 'id')
  const strapi = strapiGroupsClient()

  const existing: any = await strapi(`/course-groups/${id}`)
  if (existing.data.attributes.creadoPorUserId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'No puedes borrar este grupo' })
  }

  return strapi(`/course-groups/${id}`, { method: 'DELETE' })
})