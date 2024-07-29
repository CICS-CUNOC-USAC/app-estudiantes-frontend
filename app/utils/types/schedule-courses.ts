export type ScheduleCourse = {
  curso: string;
  docente: string;
  codigo: string;
  semestre: string;
  codigo_salon: string;
  nombre_salon: string;
}

export type ScheduleLine = {
  hora: string;
  cursos: Array<ScheduleCourse>;
}
