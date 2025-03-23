import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

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
    headerPadding: '0px'
  },
  datatable: {
    // borderColor: '#000 !important',
    // headerBorderColor: 'red !important',
  },
  multiselect: {
    shadow: 'none',
    focusRingShadow: '0 0 0 2px color-mix(in srgb, {primary.500}, transparent 50%)',
    borderRadius: '8px',
    overlayBorderRadius: '8px',
    
    colorScheme: {
      light: {
        overlayBackground: '{surface.50}',
        overlayBorderColor: '#000',
        borderColor: '#000',
        hoverBorderColor: '#000',
        focusBorderColor: '#000',
        background: '{surface.50}'
      },
      dark: {
        overlayBackground: '{surface.900}',
        overlayBorderColor: '{surface.700}',
        borderColor: '{surface.700}',
        hoverBorderColor: '{surface.700}',
        focusBorderColor: '{surface.700}',
        background: '{surface.900}'
      }
    }
  },
  select: {
    shadow: 'none',
    focusRingShadow: '0 0 0 2px color-mix(in srgb, {primary.500}, transparent 50%)',
    borderRadius: '8px',
    overlayBorderRadius: '8px',
    
    colorScheme: {
      light: {
        overlayBackground: '{surface.50}',
        overlayBorderColor: '#000',
        borderColor: '#000',
        hoverBorderColor: '#000',
        focusBorderColor: '#000',
        background: '{surface.50}'
      },
      dark: {
        overlayBackground: '{surface.900}',
        overlayBorderColor: '{surface.700}',
        borderColor: '{surface.700}',
        hoverBorderColor: '{surface.700}',
        focusBorderColor: '{surface.700}',
        background: '{surface.900}'
      }
    }
  },
  toggleswitch: {
    border: {
      color: '#000'
    },
    checked: {
      hoverBorderColor: '#000',
      borderColor: '#000'
    },

    hover: {
      borderColor: '#000'
    }
  },
  checkbox: {
    borderRadius: '0px',
    borderColor: '#000',
    checkedBorderColor: '#000',
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

const PurplePrimaries = {
  name: 'Morado',
  values: {
    50: '{purple.50}',
    100: '{purple.100}',
    200: '{purple.200}',
    300: '{purple.300}',
    400: '{purple.400}',
    500: '{purple.500}',
    600: '{purple.600}',
    700: '{purple.700}',
    800: '{purple.800}',
    900: '{purple.900}',
    950: '{purple.950}'
  }
}

const RosePrimaries = {
  name: 'Rosa',
  values: {
    50: '{rose.50}',
    100: '{rose.100}',
    200: '{rose.200}',
    300: '{rose.300}',
    400: '{rose.400}',
    500: '{rose.500}',
    600: '{rose.600}',
    700: '{rose.700}',
    800: '{rose.800}',
    900: '{rose.900}',
    950: '{rose.950}'
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

const AmberPrimaries = {
  name: 'Ambar',
  values: {
    50: '{amber.50}',
    100: '{amber.100}',
    200: '{amber.200}',
    300: '{amber.300}',
    400: '{amber.400}',
    500: '{amber.500}',
    600: '{amber.600}',
    700: '{amber.700}',
    800: '{amber.800}',
    900: '{amber.900}',
    950: '{amber.950}'
  }
}

const EmeraldPrimaries = {
  name: 'Esmeralda',
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

const GreenPrimaries = {
  name: 'Verde',
  values: {
    50: '{green.50}',
    100: '{green.100}',
    200: '{green.200}',
    300: '{green.300}',
    400: '{green.400}',
    500: '{green.500}',
    600: '{green.600}',
    700: '{green.700}',
    800: '{green.800}',
    900: '{green.900}',
    950: '{green.950}'
  }
}

const LimePrimaries = {
  name: 'Lima',
  values: {
    50: '{lime.50}',
    100: '{lime.100}',
    200: '{lime.200}',
    300: '{lime.300}',
    400: '{lime.400}',
    500: '{lime.500}',
    600: '{lime.600}',
    700: '{lime.700}',
    800: '{lime.800}',
    900: '{lime.900}',
    950: '{lime.950}'
  }
}

const RedPrimaries = {
  name: 'Rojo',
  values: {
    50: '{red.50}',
    100: '{red.100}',
    200: '{red.200}',
    300: '{red.300}',
    400: '{red.400}',
    500: '{red.500}',
    600: '{red.600}',
    700: '{red.700}',
    800: '{red.800}',
    900: '{red.900}',
    950: '{red.950}'
  }
}

const PinkPrimaries = {
  name: 'Rosado',
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

const SlatePrimaries = {
  name: 'Slate',
  values: {
    50: '{slate.50}',
    100: '{slate.100}',
    200: '{slate.200}',
    300: '{slate.300}',
    400: '{slate.400}',
    500: '{slate.500}',
    600: '{slate.600}',
    700: '{slate.700}',
    800: '{slate.800}',
    900: '{slate.900}',
    950: '{slate.950}'
  }
}

const GrayPrimaries = {
  name: 'Gris',
  values: {
    50: '{gray.50}',
    100: '{gray.100}',
    200: '{gray.200}',
    300: '{gray.300}',
    400: '{gray.400}',
    500: '{gray.500}',
    600: '{gray.600}',
    700: '{gray.700}',
    800: '{gray.800}',
    900: '{gray.900}',
    950: '{gray.950}'
  }
}

export const allThemesPrimaries = [
  OrangePrimaries,
  BluePrimaries,
  FuchsiaPrimaries,
  TealPrimaries,
  YellowPrimaries,
  AmberPrimaries,
  EmeraldPrimaries,
  PinkPrimaries,
  StonePrimaries,
  LimePrimaries,
  RedPrimaries,
  GreenPrimaries,
  PurplePrimaries,
  RosePrimaries,
  SlatePrimaries,
  GrayPrimaries
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
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}'
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
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}'
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
  options: { ...commonOptionsDefaults }
}
