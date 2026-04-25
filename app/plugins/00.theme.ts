import { allThemes, defaultTheme } from '~/themes/themes'

export default defineNuxtPlugin((nuxtApp) => {
  const themeCookie = useCookie('cicsapp-theme')
  const themeName = themeCookie.value ?? defaultTheme.name
  const selected = allThemes.find((t) => t.name === themeName) ?? defaultTheme

  const vars = Object.entries(selected.palette)
    .map(([shade, value]) => `--primary-${shade}:${value}`)
    .join(';')

  useHead({
    style: [{ innerHTML: `:root{${vars}}`, tagPriority: 'critical' }],
  })
})
