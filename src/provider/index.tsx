import { FallbackLoader } from '@/components/ui/fallback-loader'
import { AppProvider } from '@/context/app-context'
import { FarmingProvider } from '@/context/farming-context'
import { BASE_API_URL, TONCONNECT_MANIFEST_URL } from '@/lib/constants'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { Suspense, useEffect } from 'react'
import { BattleMinigamesRouting } from './battle-minigames-routing'
import { TelegramProvider } from './telegram'
import { WebSocketProvider } from './web-socket-provider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Limit retries to 3 and avoid retrying on auth errors
      retry: (failureCount, error: any) => {
        const status = error?.status ?? error?.response?.status
        if (status === 401 || status === 403) return false
        return failureCount < 4
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 3,
    },
  },
})

export const Provider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('vconsole').then((m) => new m.default())
    }
  }, [])

  return (
    <Suspense fallback={<FallbackLoader />}>
      <QueryClientProvider client={queryClient}>
        <TonConnectUIProvider manifestUrl={TONCONNECT_MANIFEST_URL}>
          <WebSocketProvider apiBaseUrl={BASE_API_URL}>
            <AppProvider>
              <TelegramProvider>
                <BattleMinigamesRouting>
                  <FarmingProvider>{children}</FarmingProvider>
                </BattleMinigamesRouting>
              </TelegramProvider>
            </AppProvider>
          </WebSocketProvider>
        </TonConnectUIProvider>
      </QueryClientProvider>
    </Suspense>
  )
}
