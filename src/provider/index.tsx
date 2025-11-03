import { FallbackLoader } from '@/components/ui/fallback-loader'
import { AppProvider } from '@/context/app-context'
import { FarmingProvider } from '@/context/farming-context'
import { GateProvider } from '@/context/gate-context'
import { Suspense, lazy, useEffect } from 'react'
import { BattleMinigamesRouting } from './battle-minigames-routing'
import { TelegramProvider } from './telegram'

const HeavyProvider = lazy(() =>
  import('./heavy-provider').then((m) => ({ default: m.HeavyProvider })),
)

export const Provider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('vconsole').then((m) => new m.default())
    }
  }, [])

  return (
    <Suspense fallback={<FallbackLoader />}>
      <HeavyProvider>
        <AppProvider>
          <TelegramProvider>
            <BattleMinigamesRouting>
              <GateProvider>
                <FarmingProvider>{children}</FarmingProvider>
              </GateProvider>
            </BattleMinigamesRouting>
          </TelegramProvider>
        </AppProvider>
      </HeavyProvider>
    </Suspense>
  )
}
