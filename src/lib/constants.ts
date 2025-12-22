// Social links
export const WEBSITE_URL = 'https://nymb.app'
export const TWITTER_URL = 'https://x.com/NYMB_app'
export const TELEGRAM_URL = 'https://t.me/nymb_app'
export const INSTAGRAM_URL = 'https://www.instagram.com/nymb_app'
export const YOU_TUBE_URL = 'https://www.youtube.com/@NYMB_app'
export const SELF_HOST_URL = 'https://nymb-preprod.netlify.app'

// Addresses
export const RECEIVER_ADDRESS =
  import.meta.env.VITE_PUBLIC_RECEIVER_ADDRESS ??
  'UQBLtmzfUtD0QDe6zLYJSOd_O9f3nwaD1kuNmuD1rrktyjNs'
export const TONCONNECT_MANIFEST_URL =
  'https://nymb.app/tonconnect-manifest.json'

// Environment Variables
export const BASE_API_URL =
  import.meta.env.VITE_PUBLIC_API_URL || 'https://api.nymb-test.icu'
export const ADSGRAM_APP_ID =
  import.meta.env.VITE_PUBLIC_ADSGRAM_APP_ID || 16790
export const TELEGRAM_APP_LINK =
  import.meta.env.VITE_PUBLIC_TELEGRAM_APP_LINK ||
  'https://t.me/nymb_twa_bot/nymb'
export const ENV = import.meta.env.VITE_PUBLIC_ENV ?? 'production'
export const TELEGRAM_CHANNEL_URL =
  import.meta.env.VITE_TELEGRAM_CHANNEL_URL || 'https://telegram-apps.com/nymb'

// ENV variables
export const API_URL =
  import.meta.env.VITE_PUBLIC_API_URL ?? 'https://api.nymb.io'
export const TELEGRAM_APP_URL =
  import.meta.env.VITE_PUBLIC_TELEGRAM_APP_LINK ??
  'https://t.me/nymb_twa_bot/nymb'
