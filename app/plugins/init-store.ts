import { useAuthStore } from '~/stores/auth'
import { useConfigsStore } from '~/stores/config'

export default defineNuxtPlugin(async (_nuxtApp) => {
  const authStore = useAuthStore()
  const configStore = useConfigsStore()
  await authStore.fetchAuth()
  configStore.initTheme()
})
