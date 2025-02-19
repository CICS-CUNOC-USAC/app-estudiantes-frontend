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
        action: [],
        subject: [],
      },
      {
        itemName: 'Biblioteca (Físico)',
        itemIcon: 'icon-park-twotone:book-one',
        itemLink: '/admin/books/physical',
        action: [],
        subject: [],
      },

    ]
  },
  {
    sectionName: 'Biblioteca',
    shortName: 'Biblioteca',
    items: [
      {
        itemName: 'Préstamos',
        itemIcon: 'lucide:hand-helping',
        itemLink: '/admin/books/loans',
        action: [],
        subject: [],
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
    ]
  }
]