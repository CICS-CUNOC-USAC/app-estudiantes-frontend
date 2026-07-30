import { ref, computed } from 'vue'
import { getCareers, getPensumsByCareer, getCoursesByPensum } from '~/lib/api/courses-catalog/pensum-courses'
import type { Career, Pensum, PensumCoursesResponse, PensumSemesterCourse } from '~/utils/types/pensum-courses'

export function useCatalog() {
  const loading = ref(false)
  const careers = ref<Career[]>([])
  const pensums = ref<Pensum[]>([])
  const coursesResponse = ref<PensumCoursesResponse | null>(null)

  const careerOptions = computed(() => {
    return careers.value.map((c: Career) => ({
      label: c.name,
      value: String(c.code) 
    }))
  })

  const pensumOptions = computed(() => {
    return pensums.value.map((p: Pensum) => ({
      label: `${p.year} ${p.active ? '(Vigente)' : ''}`,
      value: String(p.id)
    }))
  })

  const allCourses = computed(() => {
    if (!coursesResponse.value?.courses) return []
    const courses: PensumSemesterCourse[] = []
    coursesResponse.value.courses.forEach((semester) => {
      courses.push(...semester.courses)
    })
    return courses
  })

  const courseOptions = computed(() => {
    return allCourses.value.map((pc: PensumSemesterCourse) => ({
      label: `${pc.course_code} - ${pc.course?.name || 'Sin nombre'}`,
      value: pc.course_code,
      course_code: pc.course_code,
      course_name: pc.course?.name || 'Sin nombre',
      semester: pc.semester,
      field: pc.field,
      field_name: pc.field_name,
      mandatory: pc.mandatory
    }))
  })

  async function fetchCareers() {
    loading.value = true
    try {
      careers.value = await getCareers()
      return careers.value
    } catch (error) {
      console.error('Error fetching careers:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchPensums(careerCode: number) {
    loading.value = true
    try {
      pensums.value = await getPensumsByCareer(careerCode)
      return pensums.value
    } catch (error) {
      console.error('Error fetching pensums:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchCourses(pensumId: number) {
    loading.value = true
    try {
      coursesResponse.value = await getCoursesByPensum(pensumId)
      return coursesResponse.value
    } catch (error) {
      console.error('Error fetching courses:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function clear() {
    pensums.value = []
    coursesResponse.value = null
  }

  return {
    loading,
    careers,
    pensums,
    coursesResponse,
    allCourses,
    careerOptions,
    pensumOptions,
    courseOptions,
    fetchCareers,
    fetchPensums,
    fetchCourses,
    clear
  }
}