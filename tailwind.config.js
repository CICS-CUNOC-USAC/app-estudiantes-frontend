const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/pages/**/*.{vue,js,ts,jsx,tsx}',
    './app/components/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Geist Sans', 'system-ui','sans-serif'],
      'mono': ['Geist Mono', 'ui-monospace'],
    }
  },
  plugins: [
    require('tailwindcss-primeui'),
    require('@tailwindcss/typography'),
    'prettier-plugin-tailwindcss'
    // plugin(({ addUtilities }) => {
    //   addUtilities({
    //     '.shadow-flat': {
    //       'box-shadow': '2px 2px 0 0 var(--p-surface-300,rgba(0,0,0,0.8))'
    //     }
    //   })
    // })
  ]
}
