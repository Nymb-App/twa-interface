export const TWITTER_URL = 'https://x.com/NYMB_app'
export const TELEGRAM_URL = 'https://t.me/nymb_app'

export const WEBSITE_URL = import.meta.env.VITE_PUBLIC_WEBSITE_URL || 'https://nymb.app';
export const RECEIVER_ADDRESS = import.meta.env.VITE_PUBLIC_RECEIVER_ADDRESS ?? "UQBLtmzfUtD0QDe6zLYJSOd_O9f3nwaD1kuNmuD1rrktyjNs";
export const TONCONNECT_MANIFEST_URL = 'https://nymb.app/tonconnect-manifest.json';

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
