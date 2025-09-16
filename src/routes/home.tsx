import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { isAndroid } from 'react-device-detect'
import {
  Suspense,
  lazy,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useCheckIn } from '@/hooks/use-get-daily-rewards'
import { PageLayout } from '@/components/ui/page-layout'
import ProgressSection from '@/components/home-page/progress-section'
import { CardContent } from '@/components/ui/card-content'
import { FarmingButton } from '@/components/ui/button-farming'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccountMe } from '@/hooks/api/use-account'

const SwipeCard = lazy(() =>
  import('@/components/swipe-card').then((m) => ({ default: m.SwipeCard })),
)

const BattleCard = lazy(() =>
  import('@/components/battle-card').then((m) => ({ default: m.BattleCard })),
)
const GameCard = lazy(() =>
  import('@/components/game-card').then((m) => ({ default: m.GameCard })),
)
const HomeComponent = memo(function HomeComponent() {
  const [isClaimStart, setIsClaimStart] = useState(false)

  const handleClaimClick = useCallback(() => {
    setIsClaimStart(true)
  }, [])

  const { dailyRewardsQuery } = useCheckIn()

  const { accountQuery } = useAccountMe()

  const accountTime = useMemo(() => {
    if (!accountQuery.data || !accountQuery.data.time) return 0
    return accountQuery.data.time * 1000
  }, [accountQuery.data])

  const router = useRouter()

  useEffect(() => {
    const now = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    )

    const todayInSeconds = Math.floor(now.getTime() / 1000)

    if (accountQuery.data && !accountQuery.data.isFinishOnboarding)
      router.navigate({ to: '/onboarding' })

    if (
      dailyRewardsQuery.data?.nextAvailableAt &&
      dailyRewardsQuery.data.nextAvailableAt === todayInSeconds
    ) {
      router.navigate({ to: '/check-in' })
    }
  }, [dailyRewardsQuery, router])

  return (
    <PageLayout className='top-24'>
      <ProgressSection isClaimStart={isClaimStart} />
      <div className="mt-5 px-4">
        <div className="grid grid-cols-2 gap-2">
          <Link to="/minigames/slide" disabled={accountTime < Date.now()}>
            {isAndroid ? (
              <>
                <Suspense
                  fallback={
                    <Skeleton className="w-full h-[224px] rounded-2xl" />
                  }
                >
                  <SwipeCard
                    className="font-pixel w-full font-[400]"
                    classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
                    title="Swipes"
                    description={"let's see how you react"}
                  />
                </Suspense>
              </>
            ) : (
              <Suspense
                fallback={<Skeleton className="w-full h-[224px] rounded-2xl" />}
              >
                <GameCard
                  delay={1000}
                  placeholderSrc="/lottie-placeholder/minigames/slide.webp"
                  className="font-pixel w-full font-[400]"
                  classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[130%] -top-[50%] opacity-20"
                  title="Swipes"
                  description={"let's see how you react"}
                  animationData={'/lottie/swipe2.json'}
                />
              </Suspense>
            )}
          </Link>

          <Link to="/minigames/battle" disabled={accountTime < Date.now()}>
            <Suspense
              fallback={<Skeleton className="w-full h-[224px] rounded-2xl" />}
            >
              <BattleCard
                className="font-pixel w-full"
                classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(133,_59,_241,_1)_15%,_rgba(133,_59,_241,_0.9)_30%,_rgba(133,_59,_241,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
                title="Battle"
                description="are you strong enough?"
              />
            </Suspense>
          </Link>
        </div>
        <div className="mt-2 mb-[26px] grid grid-cols-2 gap-2">
          <Link to="/shop">
            <CardContent />
          </Link>
          <CardContent isLocked />
        </div>
        <FarmingButton
          onClick={handleClaimClick}
          className="w-full disabled:cursor-not-allowed disabled:from-white disabled:to-[#999999]"
          disabled={accountTime < Date.now()}
        />
      </div>
    </PageLayout>
  )
})

export const Route = createFileRoute('/home')({
  component: HomeComponent,
})
