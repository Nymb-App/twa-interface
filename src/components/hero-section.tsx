import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { isAndroid } from 'react-device-detect'
import { Card } from '@/components/ui/card'
import { TasksIcon } from '@/assets/icons/tasks'
import { StatisticsIcon } from '@/assets/icons/statistics'
import { SocialIcon } from '@/assets/icons/social'
import { SwipeCard } from '@/components/swipe-card'
import { GameCard } from '@/components/game-card'
import { BattleCard } from '@/components/battle-card'
import { useGetDailyRewards } from '@/hooks/use-get-daily-rewards'

export function HeroSection() {
  const { dailyRewardsQuery } = useGetDailyRewards()

  console.log(dailyRewardsQuery.data)

  const [isDailyReward, setIsDailyReward] = useState<boolean>(false)

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
    console.log(todayInSeconds, 'today')
    console.log(dailyRewardsQuery.data?.nextAvailableAt)
    if (
      dailyRewardsQuery.data?.nextAvailableAt &&
      dailyRewardsQuery.data.nextAvailableAt === todayInSeconds
    ) {
      setIsDailyReward(true)
    }
  }, [dailyRewardsQuery])

  return (
    <section className="relative mt-48 text-2xl text-white px-3">
      <h2 className="font-pixel text-center animate-slide-up-fade-0">
        WHAT AWAITS YOU
      </h2>

      <div className="flex flex-col gap-2">
        <Link
          to={isDailyReward ? '/check-in' : '/home'}
          className="text-white z-50 text-xl"
        >
          Home
        </Link>
      </div>

      <div className="inline-flex justify-between gap-2 w-full mt-7 animate-slide-up-fade-1">
        {isAndroid ? (
          <SwipeCard
            className="w-full"
            classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
            title="Swipes"
            description={"let's see how"}
            subdescription="you react"
          />
        ) : (
          <GameCard
            delay={1000}
            placeholderSrc="/lottie-placeholder/minigames/slide.png"
            className="w-full"
            classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[130%] -top-[50%] opacity-20"
            title="Swipes"
            description={"let's see how"}
            subdescription="you react"
            animationData={'/lottie/swipe2.json'}
          />
        )}

        <BattleCard
          className="w-full"
          classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(133,_59,_241,_1)_15%,_rgba(133,_59,_241,_0.9)_30%,_rgba(133,_59,_241,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
          title="Battle"
          description="are you strong"
          subdescription="enough?"
        />
      </div>
      <div className="inline-flex w-full gap-2 mt-2 animate-slide-up-fade-2">
        <Card className="w-full aspect-square flex justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mt-5">
            <TasksIcon className="size-8" />
            <span className="text-xs text-white/60">Tasks</span>
          </div>
        </Card>
        <Card className="w-full aspect-square flex justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mt-5">
            <SocialIcon className="size-8" />
            <span className="text-xs text-white/60">Referals</span>
          </div>
        </Card>
        <Card className="w-full aspect-square flex justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mt-5">
            <StatisticsIcon className="size-8" />
            <span className="text-xs text-white/60">Star Board</span>
          </div>
        </Card>
      </div>
    </section>
  )
}
