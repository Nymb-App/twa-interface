import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useApi } from './use-api'
import { useAccountMe } from './use-account'

export type TShopItem = 'energy' | 'time' | 'time_one_week' | 'time_one_year'
// interface IShopItem {
//   item: TShopItem;
//   pricePerUnit: number;
//   amountInUnits: number;
// }

export function useShop() {
  const { post, get } = useApi()

  const {
    data: items,
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = useQuery({
    queryKey: ['get-shop-items'],
    queryFn: async () => await get('/shop/shop_items'),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
  })

  const buyItem = useCallback(
    async (itemName: TShopItem, hash: string) => {
      return await post('/shop/buy_item', {
        item: itemName,
        hash,
      })
    },
    [items],
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
