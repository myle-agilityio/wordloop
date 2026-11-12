interface ImportMetaEnv {
  readonly VITE_NEON_AUTH_URL: string
  readonly VITE_NEON_DATA_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** The `version` from package.json, set by Vite's `define`. */
declare const __APP_VERSION__: string
