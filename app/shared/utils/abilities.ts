export const showMenuItem = defineAbility(
  (user: Staff, action: string, subject: string) => {
    // check if user has permission to show menu item in the sidebar menu, based on the permissions array inside the roles array in the user object
    if (!action || !subject) {
      return true
    }

    const hasPermission = user.roles.some((role) => {
      return role.permissions.some((permission) => {
        return (
          subject.includes(permission.subject) &&
          action.includes(permission.action)
        )
      })
    })

    return hasPermission
  }
)
