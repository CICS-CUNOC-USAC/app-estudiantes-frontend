import horarioImg from '~/assets/img/horario.jpg'
import pensumImg from '~/assets/img/pensum.jpeg'
import faqImg from '~/assets/img/faq.jpg'

import cicsImg from '~/assets/img/cics.png'
import aeioImg from '~/assets/img/aeio.jpg'

import manualesImg from '~/assets/img/manuales.jpg'
import bibliotecaImg from '~/assets/img/biblioteca.jpg'
import tesarioImg from '~/assets/img/tesario.jpg'

import acercaDeImg from '~/assets/img/acerca_de.jpg'
import mapaImg from '~/assets/img/mapa.jpg'

export const sections = [
  {
    containerClass: 'grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4',
    icon: 'icon-park-twotone:info',
    name: 'basicInfo',
    title: 'Información Básica',
    items: [
      {
        title: 'Horarios de Semestre',
        subtitle: 'Para organizarte',
        description: 'Horarios de clases y laboratorios del semestre en curso',
        route: '/portal/general/horarios',
        img: horarioImg
      },
      {
        title: 'Pensums de Estudio',
        subtitle: 'Para planificar',
        description:
          ' Recopilatorio de los pensums de las diferentes carreras de la division, y herramienta para calcular diferentes datos acerca de tu pensum.',
        route: '/portal/general/pensums',
        img: pensumImg
      },
      {
        title: 'FAQ | Primer Ingreso',
        subtitle: 'Para ayudarte al inicio',
        description:
          'Preguntas Frecuentes para los estudiantes de primer ingreso',
        route: '/portal/general/faq-primer-ingreso',
        img: faqImg
      },
      {
        title: 'FAQ',
        subtitle: 'Para ayudarte',
        description: 'Preguntas Frecuentes para estudiantes de reingreso',
        route: '/portal/general/faq',
        img: faqImg
      }
    ]
  },
  {
    containerClass: 'grid w-full grid-cols-1 gap-4 md:grid-cols-2',
    icon: 'icon-park-twotone:peoples',
    name: 'associations',
    title: 'Asociaciones',
    items: [
      {
        title: 'CICS',
        subtitle: 'Acerca del comite',
        description:
          'Informacion relevante del Comite de Ingenieria en Ciencias y Sistemas',
        route: '/portal/asociaciones/cics',
        img: cicsImg
      },
      {
        title: 'AEIO',
        subtitle: 'Acerca de la asociacion',
        description:
          'Informacion relevante de la Asociacion de Estudiantes de Ingenieria de Occidente',
        route: '/portal/asociaciones/aeio',
        img: aeioImg
      }
    ]
  },
  {
    containerClass: 'grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
    icon: 'icon-park-twotone:book-open',
    name: 'resources',
    title: 'Recursos',
    items: [
      {
        title: 'Manuales',
        subtitle: 'Para orientarte',
        description:
          'Manuales e infografias acerca de procesos importantes en la universidad',
        route: '/portal/recursos/manuales',
        img: manualesImg
      },
      {
        title: 'Tesario',
        subtitle: 'Para investigar',
        description:
          'Recopilacion de las tesis de estudiantes de ingenieria a lo largo del tiempo.',
        route: '/portal/recursos/tesario',
        img: tesarioImg
      }
    ]
  },
  {
    containerClass: 'grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
    icon: 'icon-park-twotone:add-mode',
    name: 'extra',
    title: 'Extra',
    items: [
      {
        title: 'Acerca de',
        subtitle: 'Más informacion',
        description:
          'Conoce más acerca de esta aplicacion, su desarrollo, y cómo puedes contribuir',
        route: '/portal/extras/about',
        img: acercaDeImg
      },
      {
        title: 'Mapa del Módulo G',
        subtitle: 'Ubicación de salones',
        description:
          '',
        route: '/portal/extras/map',
        img: mapaImg
      }
    ]
  }
]
