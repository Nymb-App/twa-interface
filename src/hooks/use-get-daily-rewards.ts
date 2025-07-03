import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from './api/use-api'

export interface CheckInRewards {
  energy: number
  time: number // in seconds
  tickets: number
}

export interface CheckInData {
  startedAt: number
  nextAvailableAt: number
  ticketsToReceiveAt: number
  rewards: CheckInRewards
}

export function useGetDailyRewards() {
  const { get } = useApi()

  const dailyRewardsQuery = useQuery<CheckInData, Error>({
    queryKey: ['dailyRewards'],
    queryFn: async () => {
      // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const timezone = 'UTC%2B0'
      const data = await get(
        // `/check_in/get_daily_rewards?timezone=${encodeURIComponent(timezone)}`,
        `/check_in/get_daily_rewards?timezone=${timezone}`,
      )
      return data as CheckInData
    },
    staleTime: 5 * 60 * 1000, // Кэш на 5 минут
  })

  return {
    dailyRewardsQuery,
  }
}

export function useCheckIn() {
  const { post } = useApi()
  const queryClient = useQueryClient()

  const checkInMutation = useMutation<any, Error, void>({
    mutationFn: () => {
      const timezone = 'UTC%2B0'
      return post(`/check_in/check-in?timezone=${timezone}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyRewards'] })
    },
  })

  return {
    checkIn: checkInMutation.mutate,
    isCheckingIn: checkInMutation.isPending,
    checkInError: checkInMutation.error,
  }
}
