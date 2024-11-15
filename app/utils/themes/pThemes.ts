import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const commonOptionsDefaults = {
  // darkModeSelector: '.my-app-dark'
}
const commonComponentsDefaults = {
  button: {
    borderRadius: 'calc(0.75rem - 2px) !important'
  },
  menu: {
    background: 'transparent !important'
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

export const AuraBase = definePreset(Aura, {
  options: commonOptionsDefaults,
  name: 'AuraBase',
  components: commonComponentsDefaults,
  semantic: {
    primary: {
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
    },
    colorScheme: {
      light: {
        surface: {
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
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}'
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      },
      dark: {
        surface: {
          50: '{zinc.950}',
          100: '{zinc.900}',
          200: '{zinc.800}',
          300: '{zinc.700}',
          400: '{zinc.600}',
          500: '{zinc.500}',
          600: '{zinc.400}',
          700: '{zinc.300}',
          800: '{zinc.200}',
          900: '{zinc.100}',
          950: '{zinc.50}'
        },
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}'
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        }
      }
    }
  }
})
