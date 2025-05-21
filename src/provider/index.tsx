import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TelegramProvider } from './telegram'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

const queryClient = new QueryClient()
export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider manifestUrl='https://numb-test.vercel.app/manifest/tonconnect-manifest.json'>
        <TelegramProvider>
          {children}
        </TelegramProvider>
      </TonConnectUIProvider>
    </QueryClientProvider>
  )
}
