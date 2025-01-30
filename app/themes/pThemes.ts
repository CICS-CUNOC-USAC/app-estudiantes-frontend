import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import Lara from '@primevue/themes/lara'

const commonOptionsDefaults = {
  darkModeSelector: '.dark'
}
const commonComponentsDefaults = {
  menu: {
    background: 'transparent !important'
  },
  fileupload: {
    contentPadding: '0px',
    filePadding: '0px',
    headerPadding: '0px',
  },
  toggleswitch: {
    border: {
      color: '#000'
    },
    checked: {
      hoverBorderColor: '#000',
      borderColor: '#000',
    },

    hover: {
      borderColor: '#000'
    },
  },
  breadcrumb: {
    colorScheme: {
      light: {
        background: '{zinc.100}'
      },
      dark: {
        background: '{zinc.900}'
      }
    }
  }
}

const OrangePrimaries = {
  name: 'Naranja',
  values: {
    50: '{orange.50}',
    100: '{orange.100}',
    200: '{orange.200}',
    300: '{orange.300}',
    400: '{orange.400}',
    500: '{orange.500}',
    600: '{orange.600}',
    700: '{orange.700}',
    800: '{orange.800}',
    900: '{orange.900}',
    950: '{orange.950}'
  }
}

const BluePrimaries = {
  name: 'Azul',
  values: {
    50: '{indigo.50}',
    100: '{indigo.100}',
    200: '{indigo.200}',
    300: '{indigo.300}',
    400: '{indigo.400}',
    500: '{indigo.500}',
    600: '{indigo.600}',
    700: '{indigo.700}',
    800: '{indigo.800}',
    900: '{indigo.900}',
    950: '{indigo.950}'
  }
}

const FuchsiaPrimaries = {
  name: 'Fuchsia',
  values: {
    50: '{fuchsia.50}',
    100: '{fuchsia.100}',
    200: '{fuchsia.200}',
    300: '{fuchsia.300}',
    400: '{fuchsia.400}',
    500: '{fuchsia.500}',
    600: '{fuchsia.600}',
    700: '{fuchsia.700}',
    800: '{fuchsia.800}',
    900: '{fuchsia.900}',
    950: '{fuchsia.950}'
  }
}

const TealPrimaries = {
  name: 'Aqua',
  values: {
    50: '{teal.50}',
    100: '{teal.100}',
    200: '{teal.200}',
    300: '{teal.300}',
    400: '{teal.400}',
    500: '{teal.500}',
    600: '{teal.600}',
    700: '{teal.700}',
    800: '{teal.800}',
    900: '{teal.900}',
    950: '{teal.950}'
  }
}

const YellowPrimaries = {
  name: 'Amarillo',
  values: {
    50: '{yellow.50}',
    100: '{yellow.100}',
    200: '{yellow.200}',
    300: '{yellow.300}',
    400: '{yellow.400}',
    500: '{yellow.500}',
    600: '{yellow.600}',
    700: '{yellow.700}',
    800: '{yellow.800}',
    900: '{yellow.900}',
    950: '{yellow.950}'
  }
}

const EmeraldPrimaries = {
  name: 'Verde',
  values: {
    50: '{emerald.50}',
    100: '{emerald.100}',
    200: '{emerald.200}',
    300: '{emerald.300}',
    400: '{emerald.400}',
    500: '{emerald.500}',
    600: '{emerald.600}',
    700: '{emerald.700}',
    800: '{emerald.800}',
    900: '{emerald.900}',
    950: '{emerald.950}'
  }
}

const PinkPrimaries = {
  name: 'Rosa',
  values: {
    50: '{pink.50}',
    100: '{pink.100}',
    200: '{pink.200}',
    300: '{pink.300}',
    400: '{pink.400}',
    500: '{pink.500}',
    600: '{pink.600}',
    700: '{pink.700}',
    800: '{pink.800}',
    900: '{pink.900}',
    950: '{pink.950}'
  }
}

const StonePrimaries = {
  name: 'Piedra',
  values: {
    50: '{stone.50}',
    100: '{stone.100}',
    200: '{stone.200}',
    300: '{stone.300}',
    400: '{stone.400}',
    500: '{stone.500}',
    600: '{stone.600}',
    700: '{stone.700}',
    800: '{stone.800}',
    900: '{stone.900}',
    950: '{stone.950}'
  }
}

export const allThemesPrimaries = [
  OrangePrimaries,
  BluePrimaries,
  FuchsiaPrimaries,
  TealPrimaries,
  YellowPrimaries,
  EmeraldPrimaries,
  PinkPrimaries,
  StonePrimaries
]

export const AuraBase = definePreset(Aura, {
  name: OrangePrimaries.name,
  components: commonComponentsDefaults,
  semantic: {
    primary: OrangePrimaries.values,
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{neutral.50}',
          100: '{neutral.100}',
          200: '{neutral.200}',
          300: '{neutral.300}',
          400: '{neutral.400}',
          500: '{neutral.500}',
          600: '{neutral.600}',
          700: '{neutral.700}',
          800: '{neutral.800}',
          900: '{neutral.900}',
          950: '{neutral.950}'
        },
        text: {
          color: '{zinc.800}',
          hoverColor: '{zinc.900}',
          mutedColor: '{zinc.500}',
          hoverMutedColor: '{zinc.600}'
        }
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{neutral.50}',
          100: '{neutral.100}',
          200: '{neutral.200}',
          300: '{neutral.300}',
          400: '{neutral.400}',
          500: '{neutral.500}',
          600: '{neutral.600}',
          700: '{neutral.700}',
          800: '{neutral.800}',
          900: '{neutral.900}',
          950: '{neutral.950}'
        },
        text: {
          color: '#ffffff',
          hoverColor: '{zinc.50}',
          mutedColor: '{zinc.400}',
          hoverMutedColor: '{zinc.300}'
        }
      }
    }
  }
})

export default {
  preset: AuraBase,
  options: {...commonOptionsDefaults}
}
