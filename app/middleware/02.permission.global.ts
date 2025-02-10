export default defineNuxtRouteMiddleware((to, _from) => {
  const { user } = storeToRefs(useStaffAuthStore())

  if (to.meta.layout !== 'admin') {
    return
  }

  const { subject , action } = to.meta

  if (!subject || !action) {
    return
  }

  // from the user.roles.permissions, check if the user any role that contains any permission that matches the subject and action, note that the subject and action are the meta fields in the route and are AN ARRAY

  const hasPermission = user.value?.roles.some((role) => {
    return role.permissions.some((permission) => {
      return subject.includes(permission.subject) && action.includes(permission.action)
    })
  })
  
  
  if (!hasPermission) {
    return navigateTo('/admin/home')
  }

})
