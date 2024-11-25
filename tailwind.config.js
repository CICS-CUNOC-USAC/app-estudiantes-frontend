const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/pages/**/*.{vue,js,ts,jsx,tsx}',
    './app/components/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'cics-white': '#faf6ed'
      },
      keyframes: {
        enterFromRight: {
          from: { opacity: 0, transform: 'translateX(200px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        enterFromLeft: {
          from: { opacity: 0, transform: 'translateX(-200px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        exitToRight: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(200px)' },
        },
        exitToLeft: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(-200px)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'rotateX(-10deg) scale(0.9)' },
          to: { opacity: 1, transform: 'rotateX(0deg) scale(1)' },
        },
        scaleOut: {
          from: { opacity: 1, transform: 'rotateX(0deg) scale(1)' },
          to: { opacity: 0, transform: 'rotateX(-10deg) scale(0.95)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
      },
      animation: {
        scaleIn: 'scaleIn 150ms ease',
        scaleOut: 'scaleOut 150ms ease',
        fadeIn: 'fadeIn 150ms ease',
        fadeOut: 'fadeOut 150ms ease',
        enterFromLeft: 'enterFromLeft 150ms ease',
        enterFromRight: 'enterFromRight 150ms ease',
        exitToLeft: 'exitToLeft 150ms ease',
        exitToRight: 'exitToRight 150ms ease',
      },
    },
    fontFamily: {
      // 'sans': ['Mona Sans', 'Geist Sans', 'system-ui', 'sans-serif'],
      'sans': ['Geist Sans', 'system-ui', 'sans-serif'],
      'alt': ['Hubot Sans', 'system-ui', 'sans-serif'],
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
