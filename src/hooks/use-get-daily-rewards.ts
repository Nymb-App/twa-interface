import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useApi } from './api/use-api'
import { useAccountMe } from './api/use-account'

export interface CheckInRewards {
  energy: number
  time: number // in seconds
  ticket: number
}

export interface CheckInData {
  startedAt: number
  nextAvailableAt: number
  ticketsToReceiveAt: number
  rewards: CheckInRewards
}

export function useCheckIn() {
  const { post, get } = useApi()
  const { accountQuery } = useAccountMe()
  const router = useRouter()

  const checkInMutation = useMutation<any, Error, void>({
    mutationFn: () => {
      // const timezone = 'UTC%2B0'
      return post('/check-in/check_in', {
        timezone: 'UTC+0',
      })
    },
    onError: () => {
      dailyRewardsQuery.refetch()
      accountQuery.refetch()
      router.navigate({ to: '/home' })
    },
    onSuccess: () => {
      dailyRewardsQuery.refetch()
      accountQuery.refetch()
      router.navigate({ to: '/home' })
    },
  })

  const dailyRewardsQuery = useQuery<CheckInData, Error>({
    queryKey: ['dailyRewards'],
    queryFn: async () => {
      // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const timezone = 'UTC%2B0'
      const data = await get(
        // `/check_in/get_daily_rewards?timezone=${encodeURIComponent(timezone)}`,
        `/check-in/get_daily_rewards?timezone=${timezone}`,
      )
      return data as CheckInData
    },
    staleTime: 5 * 60 * 1000, // Кэш на 5 минут
  })

  return {
    checkIn: checkInMutation.mutate,
    isCheckingIn: checkInMutation.isPending,
    checkInError: checkInMutation.error,
    dailyRewardsQuery,
  }
}
