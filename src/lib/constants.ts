// ENV variables
export const ENV = import.meta.env.VITE_PUBLIC_ENV ?? 'development'
export const API_URL =
  import.meta.env.VITE_PUBLIC_API_URL ?? 'https://api.nymb.io'
export const TELEGRAM_APP_URL =
  import.meta.env.VITE_PUBLIC_TELEGRAM_APP_LINK ??
  'https://t.me/nymb_twa_bot/nymb'
export const ADSGRAM_APP_ID = import.meta.env.VITE_PUBLIC_ADSGRAM_APP_ID ?? ''
