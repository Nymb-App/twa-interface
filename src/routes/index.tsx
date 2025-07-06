import { lazy, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '@/components/ui/page-layout'
import { cn } from '@/utils'
import { useAuth } from '@/hooks/api/use-api'

export const Route = createFileRoute('/')({
  component: App,
})

const HeroSection = lazy(() =>
  import('@/components/hero-section').then((m) => ({ default: m.HeroSection })),
)
const MintSection = lazy(() =>
  import('@/components/mint-section').then((m) => ({ default: m.MintSection })),
)
const FlickeringGrid = lazy(() =>
  import('@/components/magicui/flickering-grid').then((m) => ({
    default: m.FlickeringGrid,
  })),
)

function App() {
  const [isAnimationCountdownFinished, setAnimationCountdownFinished] =
    useState<boolean>(false)
  const [
    isAnimationCountdownCooldownFinished,
    setAnimationCountdownCooldownFinished,
  ] = useState<boolean>(false)
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) return
    ;(async () => {
      await login()
    })()
  }, [login, isAuthenticated])

  useEffect(() => {
    const timerId0 = setTimeout(() => {
      setAnimationCountdownFinished(true)
    }, 5000)
    const timerId1 = setTimeout(() => {
      setAnimationCountdownCooldownFinished(true)
    }, 5500)

    return () => {
      clearTimeout(timerId0)
      clearTimeout(timerId1)
    }
  }, [])

  return (
    <PageLayout useFooter={false}>
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#121312_95%)] duration-500',
          // isAnimationCountdownFinished && 'h-[300px]'
        )}
      />
      <div
        className={cn(
          'absolute size-full duration-700 overflow-clip',
          isAnimationCountdownFinished && 'h-[250px]',
        )}
      >
        <FlickeringGrid
          className="absolute inset-0 z-0 size-full left-3"
          squareSize={2}
          gridGap={12}
          color="#b7ff01"
          maxOpacity={0.5}
          flickerChance={0.3}
          autoResize={!isAnimationCountdownFinished}
          width={450}
        />

        <div
          className={cn(
            'absolute size-full bg-gradient-to-b from-transparent from-50% to-[#121312]',
          )}
        />
        <div
          className={cn(
            'absolute size-full bg-gradient-to-b from-[#121312] to-transparent to-[50%]',
          )}
        />
        <div
          className={cn(
            'absolute size-full bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#121312_95%)]',
          )}
        />
        <iframe
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] border-none outline-none duration-700',
            isAnimationCountdownFinished && 'scale-75',
          )}
          src="https://rive.app/s/kxIqyPB440W_N6jMnHDnCw/embed?runtime=rive-renderer&fit=cover"
        />
      </div>
      {isAnimationCountdownCooldownFinished && (
        <div className="flex flex-col gap-12">
          <HeroSection />
          <MintSection />
        </div>
      )}
    </PageLayout>
  )
}
