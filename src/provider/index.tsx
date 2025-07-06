import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { TelegramProvider } from './telegram'
import { AppProvider } from '@/context/app-context'
import { FarmingProvider } from '@/context/farming-context'
import { GateProvider } from '@/context/gate-context'


const queryClient = new QueryClient()

export const Provider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('vconsole').then((m) => new m.default())
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <TonConnectUIProvider manifestUrl="https://numb-test.vercel.app/manifest/tonconnect-manifest.json">
          <AppProvider>
            <GateProvider>
              <FarmingProvider>
                {children}
              </FarmingProvider>
            </GateProvider>
          </AppProvider>
        </TonConnectUIProvider>
      </TelegramProvider>
    </QueryClientProvider>
  )
}
