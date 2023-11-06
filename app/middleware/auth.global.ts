import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

// Global middleware for authentication and redirection based on user role

export default defineNuxtRouteMiddleware((to, _from) => {
  const { user, getRole } = storeToRefs(useAuthStore()) // Make authenticated state reactive

  const token = useCookie('cicsapp-user-token') // Get token from cookies

  if (
    !user.value &&
    (to.fullPath.includes('dashboard') ||
      (to.fullPath.includes('admin') && !to.fullPath.includes('admin/login')))
  ) {
    return navigateTo('/')
  }

  // If token and user exists and user is trying to access login page redirect to dashboard
  if (token.value && user.value && to.fullPath.includes('login')) {
    if (getRole.value === 'regular') {
      return navigateTo('/dashboard/profile')
    } else {
      return navigateTo('/admin/home')
    }
  }
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
