import { Link, createFileRoute } from '@tanstack/react-router'
import { isAndroid } from 'react-device-detect'
import { Suspense, lazy, useCallback, useState } from 'react'

import { FallbackLoader } from '@/components/ui/fallback-loader'

// Lazy load heavy components
const FarmingButton = lazy(() =>
  import('@/components/ui/button-farming').then((m) => ({
    default: m.FarmingButton,
  })),
)
const ProgressSection = lazy(
  () => import('@/components/home-page/progress-section'),
)
const SwipeCard = lazy(() =>
  import('@/components/swipe-card').then((m) => ({ default: m.SwipeCard })),
)
const BattleCard = lazy(() =>
  import('@/components/battle-card').then((m) => ({ default: m.BattleCard })),
)
const GameCard = lazy(() =>
  import('@/components/game-card').then((m) => ({ default: m.GameCard })),
)
const CardContent = lazy(() =>
  import('@/components/ui/card-content').then((m) => ({
    default: m.CardContent,
  })),
)
const PageLayout = lazy(() =>
  import('@/components/ui/page-layout').then((m) => ({
    default: m.PageLayout,
  })),
)

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isClaimStart, setIsClaimStart] = useState(false)

  const handleClaimClick = useCallback(() => {
    setIsClaimStart(true)
  }, [])

  return (
    <PageLayout>
      <Suspense fallback={<FallbackLoader />}>
        <ProgressSection isClaimStart={isClaimStart} />
        <div className="mt-5 px-4">
          <div className="grid grid-cols-2 gap-2">
            <Link to="/minigames/slide">
              {isAndroid ? (
                <SwipeCard
                  className="font-pixel w-full font-[400]"
                  classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
                  title="Swipes"
                  description={"let's see how you react"}
                />
              ) : (
                <GameCard
                  delay={1000}
                  placeholderSrc="/lottie-placeholder/minigames/slide.png"
                  className="font-pixel w-full font-[400]"
                  classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[130%] -top-[50%] opacity-20"
                  title="Swipes"
                  description={"let's see how you react"}
                  animationData={'/lottie/swipe2.json'}
                />
              )}
            </Link>

            <Link to="/minigames/battle">
              <BattleCard
                className="font-pixel w-full"
                classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(133,_59,_241,_1)_15%,_rgba(133,_59,_241,_0.9)_30%,_rgba(133,_59,_241,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
                title="Battle"
                description="are you strong enough?"
              />
            </Link>
          </div>
          <div className="mt-2 mb-[26px] grid grid-cols-2 gap-2">
            <CardContent link="/shop" />
            <CardContent isLocked link="/check-in" />
          </div>
          <FarmingButton onClick={handleClaimClick} className="w-full" />
        </div>
      </Suspense>
    </PageLayout>
  )
}
