import { FallbackLoader } from '@/components/ui/fallback-loader'
import { AppProvider } from '@/context/app-context'
import { FarmingProvider } from '@/context/farming-context'
import { GateProvider } from '@/context/gate-context'
import { Suspense, useEffect } from 'react'
import { BattleMinigamesRouting } from './battle-minigames-routing'
import { TelegramProvider } from './telegram'
import { WebSocketProvider } from './web-socket-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { BASE_API_URL, TONCONNECT_MANIFEST_URL } from '@/lib/constants'

const queryClient = new QueryClient();

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
                  <GateProvider>
                    <FarmingProvider>{children}</FarmingProvider>
                  </GateProvider>
                </BattleMinigamesRouting>
              </TelegramProvider>
            </AppProvider>
          </WebSocketProvider>
        </TonConnectUIProvider>
      </QueryClientProvider>
    </Suspense>
  )
}
