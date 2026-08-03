import { AcademicPeriod } from "~/lib/api/strapi/types"


export function generateAcademicPeriods(): AcademicPeriod[] {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    const currentSemester = currentMonth < 6 ? 1 : 2

    const periods: AcademicPeriod[] = []
    let id = 1

    periods.push({
        id: id++,
        name: `${currentSemester === 1 ? 'Primer' : 'Segundo'} Semestre ${currentYear}`,
        code: `${currentYear}-${currentSemester === 1 ? '1' : '2'}`,
        current: true
    })

    const prevSemester = currentSemester === 1 ? 2 : 1
    const prevYear = currentSemester === 1 ? currentYear - 1 : currentYear
    periods.push({
        id: id++,
        name: `${prevSemester === 1 ? 'Primer' : 'Segundo'} Semestre ${prevYear}`,
        code: `${prevYear}-${prevSemester}`,
        current: false
    })


    const isVacation = (currentMonth === 5 || currentMonth === 6 || currentMonth === 11 || currentMonth === 0)
    if (isVacation) {
        periods.push({
            id: id++,
            name: `Escuela de Vacaciones ${currentYear}`,
            code: `${currentYear}-EV`,
            current: false
        })
    }

    return periods
}