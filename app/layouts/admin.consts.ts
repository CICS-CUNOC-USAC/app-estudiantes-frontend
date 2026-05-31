export const ADMIN_LAYOUT_ITEMS = [
  {
    sectionName: 'Principal',
    shortName: 'Principal',
    items: [
      {
        itemName: 'Perfil',
        itemIcon: 'icon-park-twotone:people',
        itemLink: '/admin/me',
        action: [],
        subject: [],
      },
    ]
  },
  {
    sectionName: 'Recursos públicos',
    shortName: 'Recursos públicos',
    items: [
      {
        itemName: 'Biblioteca (Digital)',
        itemIcon: 'icon-park-twotone:book-one',
        itemLink: '/admin/books/digital',
        action: ['manage'],
        subject: ['Book', 'all'],
      },
      {
        itemName: 'Biblioteca (Físico)',
        itemIcon: 'icon-park-twotone:book-one',
        itemLink: '/admin/books/physical',
        action: ['manage'],
        subject: ['Book', 'all'],
      },

    ]
  },
  {
    sectionName: 'Administración',
    shortName: 'Administración',
    items: [
      {
        itemName: 'Usuarios administrativos',
        itemIcon: 'icon-park-twotone:peoples',
        itemLink: '/admin/users',
        action: ['manage'],
        subject: ['all'],
      },
      {
        itemName: 'Roles',
        itemIcon: 'icon-park-twotone:id-card-h',
        itemLink: '/admin/roles',
        action: ['manage'],
        subject: ['all'],
      },
      {
        itemName: 'Prestamos Externos',
        itemIcon: 'lucide:hand-helping',
        itemLink: '/admin/loans/outstanding',
        action: ['manage'],
        subject: ['all', 'Loan'],
      },
    ]
  },{
    sectionName: 'Generador de horarios',
    shortName: 'Generador',
    items: [
      {
        itemName: 'Panel',
        itemIcon: 'lucide:layout-dashboard',
        itemLink: '/admin/schedules-generator',
        action: [],
        subject: [],
      },
      {
        itemName: 'Datos',
        itemIcon: 'lucide:database',
        itemLink: '/admin/schedules-generator/data',
        action: [],
        subject: [],
      },
      {
        itemName: 'Horarios',
        itemIcon: 'lucide:calendar-range',
        itemLink: '/admin/schedules-generator/schedules',
        action: [],
        subject: [],
      },
      {
        itemName: 'Reportes',
        itemIcon: 'lucide:chart-column',
        itemLink: '/admin/schedules-generator/reports',
        action: [],
        subject: [],
      },
      {
        itemName: 'Acerca de',
        itemIcon: 'lucide:info',
        itemLink: '/admin/schedules-generator/about',
        action: [],
        subject: [],
      },
    ]
  }
]
