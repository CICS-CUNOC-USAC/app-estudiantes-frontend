const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", ".dark"],
  content: [
    './app/pages/**/*.{vue,js,ts,jsx,tsx}',
    './app/components/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
          'schedule': 'repeat(22, minmax(0, 1fr))',
          'classrooms': 'repeat(21, minmax(0, 1fr))',
      },
      gridTemplateRows: {
          'schedule': 'repeat(12, minmax(0, 1fr))',
          'hours': 'repeat(11, minmax(0, 1fr))',
      },
      gridColumnEnd: {
          '23': '23',
      },
      colors: {
        'cics-white': '#faf6ed',
        'cics-silver-pale': '#f8f5f3'
      },
      keyframes: {
        // Dialog animations
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        // Navigation menu animations
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
        // Navigation menu animations
        scaleIn: 'scaleIn 150ms ease',
        scaleOut: 'scaleOut 150ms ease',
        fadeIn: 'fadeIn 150ms ease',
        fadeOut: 'fadeOut 150ms ease',
        enterFromLeft: 'enterFromLeft 150ms ease',
        enterFromRight: 'enterFromRight 150ms ease',
        exitToLeft: 'exitToLeft 150ms ease',
        exitToRight: 'exitToRight 150ms ease',
        // Dialog animations
        overlayShow: 'overlayShow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
    fontFamily: {
      // 'sans': ['Switzer', 'Geist Sans', 'system-ui', 'sans-serif'],
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
