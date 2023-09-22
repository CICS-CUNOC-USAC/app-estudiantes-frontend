import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

// Global middleware for authentication and redirection based on user role

export default defineNuxtRouteMiddleware((to, _from) => {
  const { user, getRole } = storeToRefs(useAuthStore()) // Make authenticated state reactive

  const copyUser = user.value as any // Copy user object to access profile_id

  const token = useCookie('cicsapp-user-token') // Get token from cookies

  // If token exists and user is trying to access login page redirect to dashboard
  if (token.value && to.fullPath.includes('login')) {
    if (getRole.value === 'regular') {
      return navigateTo('/dashboard/profile')
    } else {
      return navigateTo('/admin/home')
    }
  }
  // Alternate version checking for profile_id
  // if (token.value && to.fullPath.includes('login')) {
  //   if (copyUser.profile_id) {
  //     return navigateTo('/dashboard/me')
  //   } else {
  //     return navigateTo('/admin/home')
  //   }
  // }

  // If token doesn't exist redirect to log in
  if (!token.value && to?.fullPath.includes('dashboard')) {
    return navigateTo('/login')
  }

  // If token exists and user is trying to access admin page, but is regular: redirect to dashboard
  if (
    token.value &&
    getRole.value === 'regular' &&
    to?.fullPath.includes('admin')
  ) {
    return navigateTo('/dashboard/home')
  }

  // If token exists and user is trying to access dashboard page, but is staff: redirect to admin
  if (
    token.value &&
    getRole.value !== 'regular' &&
    to?.fullPath.includes('dashboard')
  ) {
    return navigateTo('/admin/home')
  }
})
