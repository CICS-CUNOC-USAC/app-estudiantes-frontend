export async function requestPasswordRecovery({ email }: { email: string }) {
  const response = await $api<{
    message: string
  }>(`/auth/password-recovery`, {
    method: 'POST',
    body: {
      email
    }
  })
  return response
}

export async function resetPassword({ password: newPassword, token }: { password: string, token: string }) {
  const response = await $api<{
    message: string
  }>(`/auth/password-reset`, {
    method: 'POST',
    body: {
      new_password: newPassword,
      hash: token
    }
  })
  return response
}
