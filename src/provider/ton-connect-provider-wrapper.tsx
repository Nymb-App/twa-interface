import { TonConnectUIProvider } from '@tonconnect/ui-react'

export const TonConnectProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="https://numb-test.vercel.app/manifest/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  )
}
