export type CareerCoursesResponse = {
  career_name: string;
  career_code: number;
  courses: CareerCourses[];
}

export type CareerCourses = {
  semester: string;
  courses: SemesterCourses[];
}

export type SemesterCourses = {
  career_code: number;
  course_code: string;
  semester: number;
  field: number;
  mandatory: boolean;
  field_name: string;
  course: Course;
}

export type Course = {
  name: string;
  credits: number;
}
