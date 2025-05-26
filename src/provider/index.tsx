import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { TelegramProvider } from './telegram'
import { AppProvider } from '@/context/app-context'

const queryClient = new QueryClient()
export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider manifestUrl="https://numb-test.vercel.app/manifest/tonconnect-manifest.json">
        <TelegramProvider>
          <AppProvider>{children}</AppProvider>
        </TelegramProvider>
      </TonConnectUIProvider>
    </QueryClientProvider>
  )
}
