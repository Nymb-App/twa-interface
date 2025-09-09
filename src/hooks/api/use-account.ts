import { parseInitDataQuery, useRawInitData } from '@telegram-apps/sdk-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isTMA } from '@telegram-apps/sdk'
import { useApi } from './use-api'
import { ENV } from '@/lib/constants'

const devInitData =
  'user=%7B%22id%22%3A649685983%2C%22first_name%22%3A%22Dmitriy%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22polienko161%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FyJ_JeNbEN5vPQROkivhZRAoHz5wqfZ1To3Mo_e5EULA.svg%22%7D&chat_instance=-7293269513689266275&chat_type=sender&auth_date=1743505634&signature=QPjIV0WZgTB_g-7R43jvO-Vktj7o-SvRCACHQzVEwBw-GLCFUE59JgBSXV9vImmAySK9w_IoVZSNnI6K-FEoCA&hash=c2061dcd32363814b406676c58eacd394a3c249b80f69fe3f0ea8162a0837932'

// --- ИНТЕРФЕЙСЫ ДАННЫХ С БЭКЕНДА ---

// Так как структура Farming неизвестна, используем общий тип.
// Уточните его при необходимости.
export type IFarming = Record<string, any>

export interface IAccountMe {
  telegramId: number
  energy: number
  lvl: number
  joinedAt: Date
  lastActiveAt: Date
  nickname: string
  voucherCode: string
  referrerId0: number
  referrerId1: number
  isEarlyAccessMinted?: boolean
  photoUrl: string
  isAdmin: boolean
  farming: IFarming
  time: number
  avatarId: string
}

/**
 * Хук для получения и парсинга данных из Telegram InitData.
 */
export function useAccount() {
  let initData: string | undefined
  let parsedInitData

  try {
    const originalInitData = isTMA() ? useRawInitData()! : ''
    initData =
      originalInitData.length > 0
        ? originalInitData
        : ENV === 'production'
          ? originalInitData
          : devInitData
    parsedInitData = parseInitDataQuery(initData)
  } catch (error) {
    console.error(error)
  }

  return {
    initData,
    user: parsedInitData?.user,
  }
}

/**
 * Хук для получения данных аккаунта с бэкенда (/accounts/me).
 * Возвращает полный результат useQuery.
 */

interface IAccountQuery {
  tickets: number
  telegramId: number
  energy: number
  lvl: number
  claimTime?: number
  claimAtTime?: number
  claimedTime?: number
  nickname: string
  photoUrl: string
  joinedAt: number
  lastActiveAt: number
  ticket: number
  boost: number
  isFinishOnboarding: boolean
  farming: {
    startedAt: string
    duration: number
    reward: number
  }
  time: number
  avatarId: string
  extraBustCount?: number
  isEarlyAccessMinted?: boolean
  isSubscribed?: boolean
}

interface IGetLvlStats {
  currentLevel: number
  nextLvl: number
  ticketsRequired: number
  timeRequired: number
  isNextLvlUnlocked: boolean
  currentLvlBenefits: {
    minigameSlidePoints: number
    minigameBattleTime: number
    farmingTime: number
    dailyReward: number
    maxEnergy: number
  }
  nextLvlBenefits: {
    minigameSlidePoints: number
    minigameBattleTime: number
    farmingTime: number
    dailyReward: number
    maxEnergy: number
  }
}
export function useAccountMe() {
  const { get, post } = useApi()
  const { initData, user } = useAccount() // Нужен для enabled флага

  const accountQuery = useQuery({
    queryKey: ['account', 'me'],
    queryFn: async () => await get<IAccountQuery>('/accounts/me'),
  })

  const accountClaimReferralRewardMutation = useMutation({
    mutationFn: async () => await post('/accounts/claim_referral_reward'),
    onSuccess: () => {
      accountQuery.refetch()
    },
  })

  const getLvlStatsQuery = useQuery({
    queryKey: ['account', 'lvlStats'],
    queryFn: async () => await get<IGetLvlStats>('/accounts/get_lvl_stats'),
  })

  const lvlUpMutation = useMutation({
    mutationFn: async () => await post('/accounts/lvl_up'),
  })

  const finishOnboardingMutation = useMutation({
    mutationFn: async () => await post('/accounts/finish_onboarding'),
  })

  return {
    getLvlStats: getLvlStatsQuery,
    accountQuery,
    user,
    initData,
    lvlUpMutation,
    accountClaimReferralRewardMutation,
    finishOnboardingMutation,
    isLoading: getLvlStatsQuery.isLoading || accountQuery.isLoading,
  }
}
