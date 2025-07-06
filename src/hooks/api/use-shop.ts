import { useQuery } from '@tanstack/react-query'
import { useApi } from './use-api'
import { useTransferTon } from '../use-transfer-ton';
import { useCallback } from 'react';
import { useMint } from '../use-mint';


export type TShopItem = 'energy' | 'time' | 'time_one_week' | 'time_one_year';
interface IShopItem {
  item: TShopItem;
  pricePerUnit: number;
  amountInUnits: number;
}

export function useShop() {
  const { post, get } = useApi();
  const { collectionData } = useMint();
  const {
    transfer,
  } = useTransferTon();

  const {
    data: items,
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = useQuery({
    queryKey: ['get-shop-items'],
    queryFn: async () => (await get('/shop/shop_items')) as Array<IShopItem>,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
  });

  const buyItem = useCallback(async (itemName: TShopItem, hash: string) => {
    return await post('/shop/buy_item', {
      item: itemName,
      hash,
    });
  }, [transfer, collectionData, items]);

  return {
    itemsData: {
      items,
      isLoading: isItemsLoading,
      isError: isItemsError,
    },
    buyItem,
  }
}
