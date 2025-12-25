import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useAccountMe } from './use-account'
import { useApi } from './use-api'

export type TShopItem =
  | 'energy'
  | 'time'
  | 'time_one_week'
  | 'time_one_year'
  | 'ticket'
  | 'five_tickets'
  | 'ten_tickets'

export function useShop() {
  const { post, get } = useApi()

  const { accountQuery } = useAccountMe()

  const {
    data: items,
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = useQuery({
    queryKey: ['get-shop-items'],
    queryFn: async () => await get('/shop/shop_items'),
    // staleTime: 1000 * 60 * 60 * 24, // 24 hours
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
    // refetchOnReconnect: false,
    retry: 3,
    // Only run once the account is ready (auth completed)
    enabled: accountQuery.isSuccess,
  })

  // Internal mutation that matches React Query's expected signature (single `variables` argument)
  const buyItemMutation = useMutation({
    mutationKey: ['shop', 'buyItem'],
    mutationFn: async ({
      itemName,
      hash,
    }: {
      itemName: TShopItem
      hash: string
    }) => {
      return await post('/shop/buy_item', {
        item: itemName,
        hash,
      })
    },
    onSuccess: () => {
      accountQuery.refetch()
    },
    onError: () => {
      accountQuery.refetch()
    },
  })

  // Convenience wrapper so the rest of the codebase can keep calling `buyItem(itemName, hash)`
  const buyItem = useCallback(
    (itemName: TShopItem, hash: string) =>
      buyItemMutation.mutate({ itemName, hash }),
    [buyItemMutation],
  )

  return {
    itemsData: {
      items,
      isLoading: isItemsLoading,
      isError: isItemsError,
    },
    buyItem,
  }
}

export function useBuyExtraBoost() {
  const { post } = useApi()

  const { accountQuery } = useAccountMe()

  const buyExtraBoost = useCallback(async (hash: string) => {
    return await post('/shop/buy_extra_boost', { hash })
  }, [])

  const extraBoostCount = useMemo(() => {
    if (!accountQuery.data || !accountQuery.data.extraBustCount) return 0
    return accountQuery.data.extraBustCount
  }, [accountQuery.data])

  return {
    buyExtraBoost,
    extraBoostCount,
  }
}
