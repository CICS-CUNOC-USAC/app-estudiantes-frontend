export const DefaultLayoutItems = [
  {
    sectionName: 'Información Básica',
    shortName: 'Básico',
    items: [
      {
        itemName: 'Publicaciones Oficiales',
        itemIcon: 'lucide:scroll-text',
        itemLink: '/portal/general/publicaciones'
      },
      {
        itemName: 'Horarios',
        itemIcon: 'lucide:calendar',
        itemLink: '/portal/general/horarios'
      },
      {
        itemName: 'Programas de curso',
        itemIcon: 'lucide:book-open',
        itemLink: '/portal/general/cursos/programas'
      },
      {
        itemName: 'Pensas de estudio',
        itemIcon: 'lucide:presentation',
        itemLink: '/portal/general/pensums'
      },
      {
        itemName: 'Preguntas Frecuentes (Primer Ingreso)',
        itemIcon: 'lucide:life-buoy',
        itemLink: '/portal/general/faq-primer-ingreso'
      },
      {
        itemName: 'Preguntas Frecuentes',
        itemIcon: 'lucide:message-circle-question',
        itemLink: '/portal/general/faq'
      }

    ]
  },
  {
    sectionName: 'Asociaciones',
    shortName: 'Asociaciones',
    items: [
      {
        itemName: 'CICS',
        itemIcon: 'lucide:users',
        itemLink: '/portal/asociaciones/cics'
      },
      {
        itemName: 'AEIO',
        itemIcon: 'lucide:users',
        itemLink: '/portal/asociaciones/aeio'
      }
    ]
  },
  {
    sectionName: 'Recursos',
    shortName: 'Recursos',
    items: [
      {
        itemName: 'Manuales',
        itemIcon: 'lucide:book',
        itemLink: '/portal/recursos/manuales'
      },
      {
        itemName: 'Tesario',
        itemIcon: 'lucide:book-open',
        itemLink: '/portal/recursos/tesario'
      },
    ]
  },
  {
    sectionName: 'Extras',
    shortName: 'Extra',
    items: [
      {
        itemName: 'Configuración',
        itemIcon: 'lucide:settings-2',
        itemLink: '/portal/extras/config'
      },
      {
        itemName: 'Acerca de',
        itemIcon: 'lucide:badge-info',
        itemLink: '/portal/extras/about'
      },
    ]
  }
]