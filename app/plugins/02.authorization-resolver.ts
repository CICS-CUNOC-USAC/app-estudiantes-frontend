export default defineNuxtPlugin({
  name: 'authorization-resolver',
  parallel: true,
  setup() {
    return {
      provide: {
        authorization: {
          resolveClientUser: async () => {
            const authStore = useAuthStore()
            return authStore.user
          },
        },
      },
    }
  },
})