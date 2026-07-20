import { strapiGroupsClient } from "~~/server/utils/strapi-groups-client"
import { verifyStudentSession } from "~~/server/utils/verify-student-session"

export default defineEventHandler(async (event) => {
  const user = verifyStudentSession(event)
  const body = await readBody(event)

  return strapiGroupsClient()('/course-groups', {
    method: 'POST',
    body: {
      data: {
        courseCode: body.courseCode,
        section: body.section,
        platform: body.platform,
        link: body.link,
        type: body.type,
        academicPeriod: body.academicPeriod,
        visibility: body.visibility,
        alternativeContact: body.alternativeContact,
        contactNotes: body.contactNotes,
        createdByUserId: user.id,
        lecturer: null,
      },
    },
  })
})