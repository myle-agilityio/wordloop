import { createClient } from '@neondatabase/neon-js'
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react/adapters'

function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]
  if (!value) throw new Error(`${name} is not set. Copy .env.example to .env and fill it in.`)
  return value
}

/**
 * Neon client for sign-in (Neon Auth) and database access (Data API).
 * Data API requests carry the signed-in user's token, and row-level security
 * in the database limits each user to their own rows.
 */
export const neon = createClient({
  auth: {
    adapter: BetterAuthReactAdapter(),
    url: requireEnv('VITE_NEON_AUTH_URL'),
  },
  dataApi: {
    url: requireEnv('VITE_NEON_DATA_API_URL'),
  },
})
