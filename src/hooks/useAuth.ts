import { neon } from '@/lib'

/** The signed-in user, or null. `isPending` is true while the session is first checked. */
export function useAuth() {
  const session = neon.auth.useSession()

  return {
    user: session.data?.user ?? null,
    isPending: session.isPending,
  }
}
