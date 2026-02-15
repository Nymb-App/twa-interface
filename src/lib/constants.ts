// Social links
export const WEBSITE_URL = 'https://nymb.app'
export const TWITTER_URL = 'https://x.com/NYMB_app'
export const TELEGRAM_URL = 'https://t.me/nymb_app'
export const INSTAGRAM_URL = 'https://www.instagram.com/nymb_app'
export const YOU_TUBE_URL = 'https://www.youtube.com/@NYMB_app'
export const SELF_HOST_URL = 'https://nymb-preprod.netlify.app'

// Founder socials
export const FOUNDER_TWITTER_URL = 'https://x.com/mrnymb'
export const FOUNDER_TELEGRAM_URL = 'https://t.me/nymb_founder'
export const FOUNDER_INSTAGRAM_URL = 'https://www.instagram.com/igor__ivanov'

// Addresses
export const RECEIVER_ADDRESS =
  import.meta.env.VITE_PUBLIC_RECEIVER_ADDRESS ??
  'UQA1C5aLqSAbl-1prBGWrocrYm4a-lvXliqEjLkqIrKqjXJu'
export const TONCONNECT_MANIFEST_URL =
  'https://nymb.netlify.app/tonconnect-manifest.json'

// Environment Variables
export const BASE_API_URL =
  import.meta.env.VITE_PUBLIC_API_URL || 'https://api.nymb-test.icu'
export const ADSGRAM_APP_ID =
  import.meta.env.VITE_PUBLIC_ADSGRAM_APP_ID || '16790'

export const ADSGRAM_BLOCK2_ID =
  import.meta.env.VITE_PUBLIC_ADSGRAM_BLOCK2_ID || '19987'

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


export const ITEM_EXTRA_BOOST = ENV === 'production' ? 0.1 : 0.05;

export const ITEM_NFT_PRICE = ENV === 'production' ? 5 : 0.05;

export const ITEM_ENERGY_1000_PRICE = ENV === 'production' ? 0.39 : 0.05;

// Time
export const ITEM_TIME_1D_PRICE = ENV === 'production' ? 0.87 : 0.05;
export const ITEM_TIME_1W_PRICE = ENV === 'production' ? 1.19 : 0.05;
export const ITEM_TIME_1M_PRICE = ENV === 'production' ? 3.49 : 0.05;
export const ITEM_TIME_1Y_PRICE = ENV === 'production' ? 16.99 : 0.05;

// Tickets
export const ITEM_TICKET_PRICE = ENV === 'production' ? 0.59 : 0.05;
export const ITEM_TICKET_5_PRICE = ENV === 'production' ? 2.69 : 0.05;
export const ITEM_TICKET_10_PRICE = ENV === 'production' ? 4.99 : 0.05;

// Unfreeze account price
export const ITEM_UNFREEZE = ENV === 'production' ? 1 : 0.15;
