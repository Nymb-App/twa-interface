import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from './use-api'

export interface IShopItem {
  id: string
  item: 'time' | 'energy'
  price: number
  amount: number
  duration: '1_day' | '1_week' | '1_month'
}

// ;[
//   {
//     _id: '6865a7ad66b08116dd6af5d6',
//     item: 'time',
//     price: 0.02,
//     amount: 86400000,
//     duration: '1_day',
//     __v: 0,
//   },
//   {
//     _id: '6865a7e7cf03673c86212688',
//     item: 'energy',
//     price: 0.2,
//     amount: 1000,
//     __v: 0,
//   },
//   {
//     _id: '6865a8091158ad3c9ff87186',
//     item: 'time',
//     price: 0.2,
//     amount: 604800000,
//     duration: '1_week',
//     __v: 0,
//   },
//   {
//     _id: '6865a83b46c1346ddeb6ab7f',
//     item: 'time',
//     price: 0.6,
//     amount: 2592000000,
//     duration: '1_month',
//     __v: 0,
//   },
// ]

export interface IBuyItemPayload {
  item: 'time' | 'energy'
  duration: '1_day' | '1_week' | '1_month'
  hash: string
}

export function useShopItems() {
  const { get } = useApi()

  const shopItemsQuery = useQuery<Array<IShopItem>, Error>({
    queryKey: ['shop', 'items'],
    queryFn: async () => (await get('/shop/shop_items')),
    staleTime: 15 * 60 * 1000,
  })

  return {
    shopItemsQuery,
  }
}

export function useBuyItem() {
  const { post } = useApi()
  const queryClient = useQueryClient()

  const buyItemMutation = useMutation<any, Error, IBuyItemPayload>({
    mutationFn: (payload) => post('/shop/buy_item', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
    },
  })

  return {
    buyItem: buyItemMutation.mutate,
    isBuying: buyItemMutation.isPending,
    buyItemError: buyItemMutation.error,
  }
}
