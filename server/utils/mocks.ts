import { CourseGroup } from '../../app/lib/api/strapi/types';

export const groupsMock: CourseGroup[] = [
  {
    id: 1,
    courseCode: '2796',
    courseNameCache: 'Introducción a la Programación y Computación 1',
    section: 'A',
    platform: 'whatsapp',
    link: 'https://chat.whatsapp.com/ejemplo1',
    type: { id: 1, name: 'Desarrollo de Software', slug: 'estudio', description: 'Grupo de estudio' },
    academicPeriod: { id: 1, name: '2024-2', code: '2024-2', current: true },
    visibility: 'abierto',
    lecturer: { 
      id: 1, 
      fullName: 'Ing. Moises Granados', 
      email: 'cperez@universidad.edu',
      school: 'Facultad de Ingeniería'
    },
    createdByUserId: 100,
    active: true
  },
  {
    id: 2,
    courseCode: '2797',
    courseNameCache: 'Lógica de Sistemas',
    section: 'B',
    platform: 'telegram',
    link: 'https://t.me/ejemplo2',
    type: { id: 2, name: 'Desarrollo de Software', slug: 'ayudantia', description: 'Ayudantía del curso' },
    academicPeriod: { id: 1, name: '2024-2', code: '2024-2', current: true },
    visibility: 'privado',
    lecturer: { 
      id: 2, 
      fullName: 'Ing. Bryan Monzon', 
      email: 'mgonzalez@universidad.edu',
      school: 'Facultad de Ciencias'
    },
    createdByUserId: 101,
    active: true
  },
  {
    id: 3,
    courseCode: '2811',
    courseNameCache: 'Arq. de Computadores y Ensambladores 1',
    section: 'A',
    platform: 'whatsapp',
    link: 'https://chat.whatsapp.com/ejemplo3',
    type: { id: 3, name: 'Ciencias de la computacion', slug: 'foro', description: 'Foro de discusión' },
    academicPeriod: { id: 2, name: '2024-1', code: '2024-1', current: false },
    visibility: 'abierto',
    lecturer: { 
      id: 3, 
      fullName: 'Ing. Mauricio Maldonado', 
      email: 'jmartinez@universidad.edu',
      school: 'Facultad de Ciencias'
    },
    createdByUserId: 102,
    active: true
  },
  {
    id: 4,
    courseCode: '2805',
    courseNameCache: 'Estructuras de Datos',
    section: 'A',
    platform: 'telegram',
    link: 'https://t.me/ejemplo4',
    type: { id: 1, name: 'Desarrollo de Software', slug: 'estudio', description: 'Grupo de estudio' },
    academicPeriod: { id: 1, name: '2024-2', code: '2024-2', current: true },
    visibility: 'abierto',
    lecturer: { 
      id: 4, 
      fullName: 'Ing. Mario Ramirez', 
      email: 'alopez@universidad.edu',
      school: 'Facultad de Ingeniería'
    },
    createdByUserId: 100,
    active: true
  },
  {
    id: 5,
    courseCode: '3000',
    courseNameCache: 'Matematica Basica 1',
    section: 'B-01',
    platform: 'whatsapp',
    link: 'https://chat.whatsapp.com/ejemplo5',
    type: { id: 2, name: 'Area Comun', slug: 'ayudantia', description: 'Ayudantía del curso' },
    academicPeriod: { id: 1, name: '2024-2', code: '2024-2', current: true },
    visibility: 'privado',
    lecturer: { 
      id: 5, 
      fullName: 'Ing. Bryan Monzon', 
      email: 'rsanchez@universidad.edu',
      school: 'Facultad de Ciencias'
    },
    createdByUserId: 103,
    active: true
  },
  {
    id: 6,
    courseCode: '2821',
    courseNameCache: 'Sistemas de Bases de Datos 2',
    section: 'C-02',
    platform: 'telegram',
    link: 'https://t.me/ejemplo6',
    type: { id: 1, name: 'Desarrollo de Software', slug: 'estudio', description: 'Grupo de estudio' },
    academicPeriod: { id: 1, name: '2024-2', code: '2024-2', current: true },
    visibility: 'abierto',
    lecturer: { 
      id: 6, 
      fullName: 'Ing. Bryan Monzon', 
      email: 'ltorres@universidad.edu',
      school: 'Facultad de Ingeniería'
    },
    createdByUserId: 101,
    active: true
  }
]
