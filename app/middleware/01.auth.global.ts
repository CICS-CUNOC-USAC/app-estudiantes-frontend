import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

// Global middleware for authentication and redirection based on user role

export default defineNuxtRouteMiddleware((to, _from) => {
  const { user, getRole } = storeToRefs(useAuthStore()) // Make authenticated state reactive

  const token = useCookie('cicsapp-user-token') // Get token from cookies

  // Match route segments, not arbitrary substrings of the path
  const isDashboardRoute = to.path.startsWith('/dashboard')
  const isAdminLoginRoute = to.path.startsWith('/admin/login')
  const isAdminRoute = to.path.startsWith('/admin') && !isAdminLoginRoute
  const isLoginRoute = to.path === '/login' || isAdminLoginRoute

  if (!user.value && (isDashboardRoute || isAdminRoute)) {
    return navigateTo('/')
  }

  // If token and user exists and user is trying to access login page redirect to dashboard
  if (token.value && user.value && isLoginRoute) {
    if (getRole.value === 'regular') {
      return navigateTo('/dashboard/profile')
    } else {
      return navigateTo('/admin/home')
    }
  }
  // If token doesn't exist redirect to log in
  if (!token.value && isDashboardRoute) {
    return navigateTo('/login')
  }

  // If token exists and user is trying to access admin page, but is regular: redirect to dashboard
  if (
    token.value &&
    getRole.value === 'regular' &&
    to.path.startsWith('/admin')
  ) {
    return navigateTo('/dashboard/home')
  }

  // If token exists and user is trying to access dashboard page, but is staff: redirect to admin
  if (
    token.value &&
    getRole.value !== 'regular' &&
    isDashboardRoute
  ) {
    return navigateTo('/admin/home')
  }
})
