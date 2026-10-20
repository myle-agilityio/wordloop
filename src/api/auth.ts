import { neon } from '@/lib'

export type SignUpResult = 'signed-in' | 'verify-email'

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await neon.auth.signIn.email({ email, password })
  if (error) throw new Error(error.message ?? 'Could not sign in.')
}

/** Creates an account. If the project requires email verification, there is no session yet. */
export async function signUp(name: string, email: string, password: string): Promise<SignUpResult> {
  const { error } = await neon.auth.signUp.email({ name, email, password })
  if (error) throw new Error(error.message ?? 'Could not create your account.')

  const { data } = await neon.auth.getSession()
  return data?.session ? 'signed-in' : 'verify-email'
}

export async function signOut(): Promise<void> {
  await neon.auth.signOut()
}
