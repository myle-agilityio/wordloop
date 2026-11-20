/** The user's theme choice. System follows the OS setting. */
export type Theme = 'light' | 'dark' | 'system'

/** The theme actually shown, after System is resolved. */
export type ResolvedTheme = Exclude<Theme, 'system'>
