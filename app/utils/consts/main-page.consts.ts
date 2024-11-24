export const sections = [
  {
    name: 'basicInfo',
    title: 'Información Básica',
    items: [
      {
        title: 'Horarios de Semestre',
        subtitle: 'Para organizarte',
        description: 'Horarios de clases y laboratorios del semestre en curso',
        route: '/portal/general/horarios',
        img: '_nuxt/assets/img/horario.jpg'
      },
      {
        title: 'Pensums de Estudio',
        subtitle: 'Para planificar',
        description:
          ' Recopilatorio de los pensums de las diferentes carreras de la division, y herramienta para calcular diferentes datos acerca de tu pensum.',
        route: '/portal/general/pensums',
        img: '_nuxt/assets/img/pensum.jpeg'
      },
      {
        title: 'FAQ | Primer Ingreso',
        subtitle: 'Para ayudarte al inicio',
        description:
          'Preguntas Frecuentes para los estudiantes de primer ingreso',
        route: '/portal/general/faq-primer-ingreso',
        img: '_nuxt/assets/img/faq.jpg'
      },
      {
        title: 'FAQ',
        subtitle: 'Para ayudarte',
        description: 'Preguntas Frecuentes para estudiantes de reingreso',
        route: '/portal/general/faq',
        img: '_nuxt/assets/img/faq.jpg'
      }
    ]
  },
  {
    name: 'associations',
    title: 'Asociaciones',
    items: [
      {
        title: 'CICS',
        subtitle: 'Acerca del comite',
        description:
          'Informacion relevante del Comite de Ingenieria en Ciencias y Sistemas',
        route: '/portal/asociaciones/cics',
        img: '_nuxt/assets/img/cics.png'
      },
      {
        title: 'AEIO',
        subtitle: 'Acerca de la asociacion',
        description:
          'Informacion relevante de la Asociacion de Estudiantes de Ingenieria de Occidente',
        route: '/portal/asociaciones/aeio',
        img: '_nuxt/assets/img/aeio.jpg'
      }
    ]
  },
  { name: 'resources', title: 'Recursos', items: [
    {
      title: 'Manuales',
      subtitle: 'Para orientarte',
      description:
        'Manuales e infografias acerca de procesos importantes en la universidad',
      route: '/portal/recursos/manuales',
      img: '_nuxt/assets/img/manuales.jpg'
    },
    {
      title: 'Biblioteca',
      subtitle: 'Para estudiar',
      description:
        'Material de estudio de los diferentes cursos de la Division',
      route: '/portal/recursos/biblioteca',
      img: '_nuxt/assets/img/biblioteca.jpg'
    },
    {
      title: 'Tesario',
      subtitle: 'Para investigar',
      description:
        'Recopilacion de las tesis de estudiantes de ingenieria a lo largo del tiempo.',
      route: '/portal/recursos/tesario',
      img: '_nuxt/assets/img/tesario.jpg'
    }
  ] },
  { name: 'extra', title: 'Extra', items: [
    {
      title: 'Acerca de',
      subtitle: 'Más informacion',
      description:
        'Conoce más acerca de esta aplicacion, su desarrollo, y cómo puedes contribuir',
      route: '/portal/extras/about',
      img: '_nuxt/assets/img/acerca_de.jpg'
    }
  ] }
]
