const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('tailwindcss-primeui'),
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
