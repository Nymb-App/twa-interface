import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi, useAuth } from './use-api'

export interface IFarmingStatus {
  startedAt: number // timestamp
  duration: number // timestamp
  reward: number
}

export function useFarming() {
  const { get, post } = useApi()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  /**
   * Запрос для получения статуса фарминга.
   */
  const farmingStatusQuery = useQuery<IFarmingStatus, Error>({
    queryKey: ['farming', 'status'],
    queryFn: async () =>
      (await get('/farming/get_farming_status')),
    staleTime: 5 * 60 * 1000, // Кэш на 5 минут
    enabled: isAuthenticated,
  })

  /**
   * Мутация для старта фарминга.
   */

  const startFarmingMutation = useMutation<any, Error, void>({
    mutationFn: () => post('/farming/start_farming'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farming', 'status'] })
    },
  })

  /**
   * Мутация для сбора награды.
   */
  const claimRewardMutation = useMutation<any, Error, void>({
    mutationFn: () => post('/farming/claim_reward'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farming', 'status'] })
      queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
    },
  })

  return {
    // Статус фарминга
    farmingStatusQuery,

    // Старт фарминга
    startFarming: startFarmingMutation.mutate,
    isStartingFarming: startFarmingMutation.isPending,
    startFarmingError: startFarmingMutation.error,

    // Сбор награды
    claimReward: claimRewardMutation.mutate,
    isClaimingReward: claimRewardMutation.isPending,
    claimRewardError: claimRewardMutation.error,
  }
}
