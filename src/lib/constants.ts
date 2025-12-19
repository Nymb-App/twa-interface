export const TWITTER_URL = 'https://x.com/NYMB_app'
export const TELEGRAM_URL = 'https://t.me/nymb_app'

export const TONCONNECT_MANIFEST_URL = 'https://numb.app/tonconnect-manifest.json';

// Environment Variables
export const BASE_API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'https://api.nymb-test.icu';
export const ADSGRAM_APP_ID = import.meta.env.VITE_PUBLIC_ADSGRAM_APP_ID || 16790;
export const TELEGRAM_APP_LINK = import.meta.env.VITE_PUBLIC_TELEGRAM_APP_LINK || 'https://t.me/nymb_twa_bot/nymb';
export const ENV = import.meta.env.VITE_PUBLIC_ENV ?? 'production';



// ENV variables
export const API_URL =
  import.meta.env.VITE_PUBLIC_API_URL ?? 'https://api.nymb.io'
export const TELEGRAM_APP_URL =
  import.meta.env.VITE_PUBLIC_TELEGRAM_APP_LINK ??
  'https://t.me/nymb_twa_bot/nymb'
