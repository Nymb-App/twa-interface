import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import useSound from 'use-sound'

import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { PageLayout } from '@/components/ui/page-layout'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import {
  useStatistics,
  type GlobalStatisticsData,
} from '@/hooks/api/use-statistics'
import { cn } from '@/lib/utils'

import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { useAccount } from '@/hooks/api/use-account'
import StarBoardImage from '/starboard-img.webp'

export const Route = createFileRoute('/star-board')({
  component: RouteComponent,
})

const formatDuration = (totalMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000))

  const SECONDS_IN_MINUTE = 60
  const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE
  const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR
  const SECONDS_IN_WEEK = 7 * SECONDS_IN_DAY
  const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY // без високосных

  let remaining = totalSeconds

  const years = Math.floor(remaining / SECONDS_IN_YEAR)
  remaining %= SECONDS_IN_YEAR

  const weeks = Math.floor(remaining / SECONDS_IN_WEEK)
  remaining %= SECONDS_IN_WEEK

  const days = Math.floor(remaining / SECONDS_IN_DAY)
  remaining %= SECONDS_IN_DAY

  const hours = Math.floor(remaining / SECONDS_IN_HOUR)
  remaining %= SECONDS_IN_HOUR

  const minutes = Math.floor(remaining / SECONDS_IN_MINUTE)
  const seconds = remaining % SECONDS_IN_MINUTE

  return {
    years,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  }
}

function RouteComponent() {
  const lvlList = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1).reverse(),
    [],
  )
  const [play] = useSound('/sounds/Button.aac', { interrupt: true })
  const { globalStatistics, myStatistics } = useStatistics()
  const { user } = useAccount()

  const myData = useMemo(() => {
    if (!myStatistics.data) {
      return {
        telegramId: user?.id ?? user?.id.toString(),
        avatarUrl: user?.photo_url,
        name: user?.username,
        time: Date.now() + 3 * 24 * 60 * 60 * 1000,
        lvl: 12,
        position: 1000,
      }
    }

    return {
      telegramId: user?.id,
      avatarUrl: user?.photo_url,
      name: user?.username ?? user?.id.toString(),
      time: myStatistics.data.time * 1000,
      lvl: myStatistics.data.lvl,
      position: myStatistics.data.place,
    }
  }, [myStatistics.data, user])

  return (
    <PageLayout
      className="flex flex-col"
      classNameContent="flex flex-col flex-1 h-full"
    >
      <header className="relative flex min-h-[175px] flex-col items-center">
        <img
          src={StarBoardImage}
          alt="preview-image"
          width={191}
          height={155}
          className="-mt-5 animate-[wiggle_3s_ease-in-out_infinite]"
        />
        <FlickeringGrid
          className="absolute inset-0 mask-[radial-gradient(ellipse_180px_100px_at_center,black,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#b7ff01"
          maxOpacity={1}
          flickerChance={0.3}
          autoResize={false}
          width={450}
          height={250}
        />
        <h1 className="font-pixel mb-10 text-center text-2xl uppercase">
          star board
        </h1>
      </header>

      <Tabs
        defaultValue={String(lvlList[0])}
        className="flex flex-col w-full mx-auto"
        onValueChange={(value) => {
          play()
          globalStatistics.loadLevel(Number(value))
        }}
      >
        <TabsList>
          <Carousel
            opts={{
              slidesToScroll: 4,
              align: 'center',
            }}
          >
            <CarouselContent className="flex mx-auto">
              {lvlList.map((item) => (
                <CarouselItem key={item} className="basis-1/4 pl-2">
                  <TabsTrigger
                    onClick={() => play()}
                    value={String(item)}
                    className="data-[state=active]:bg-[#B6FF00] data-[state=active]:text-black w-full py-2 shrink-0 bg-white/10 rounded-full text-white font-pixel text-xs uppercase text-nowrap"
                  >
                    {item} gate
                  </TabsTrigger>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </TabsList>

        {lvlList.map((lvl) => (
          <TabsContent value={String(lvl)} className="mt-7 px-4">
            <StatisticsCard
              name={myData.name!}
              time={myData.time}
              position={myData.position}
              avatarUrl={myData.avatarUrl}
              lvl={myData.lvl}
            />
            <h2 className="text-lg font-pixel text-white mt-5">
              TOP 100 USERS
            </h2>
            <div className="mt-3">
              {globalStatistics.data && (
                <StatisticsTop100List stats={globalStatistics.data[lvl]} />
              )}

              <EmptyStateCard
                title="NO USERS"
                description="ON THIS GATE"
                className={cn(
                  'mt-10',
                  globalStatistics.data &&
                    globalStatistics?.data[lvl]?.users.length > 0 &&
                    'hidden',
                )}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </PageLayout>
  )
}

function StatisticsCard({
  name,
  time,
  avatarUrl,
  lvl,
  position,
}: {
  name: string
  time: number
  position: number
  avatarUrl?: string
  lvl?: number
}) {
  const p = position < 1 ? 1 : position
  return (
    <div className="w-full rounded-2xl px-4 py-3 h-auto inline-flex items-center justify-between bg-linear-to-b from-white/0 to-white/5">
      <div className="inline-flex items-center gap-4">
        <Avatar className="relative size-8 rounded-[12px]">
          <AvatarImage src={avatarUrl ?? '/roulette-icons/default.webp'} />
          {avatarUrl === undefined && (
            <span className="font-pixel text-xs absolute left-1/2 top-1/2 -translate-1/2">
              NA
            </span>
          )}
        </Avatar>

        <div className="flex flex-col">
          <span className="text-white font-semibold text-base">{name}</span>
          {time <= Date.now() ? (
            <div className="font-pixel text-xs inline-flex font-normal text-white/60">
              <span>000</span>:<span>00</span>:<span>00</span>:<span>00</span>:
              <span>00</span>:<span>00</span>
            </div>
          ) : (
            <Countdown
              date={time}
              intervalDelay={1000}
              renderer={({ total }) => {
                const { years, weeks, days, hours, minutes, seconds } =
                  formatDuration(total)

                const isWeeksGreen = years > 0 || weeks > 0
                const isDaysGreen = isWeeksGreen || days > 0
                const isHoursGreen = isDaysGreen || hours > 0
                const isMinutesGreen = isHoursGreen || minutes > 0
                const isSecondsGreen = isMinutesGreen || seconds > 0

                return (
                  <div className="font-pixel text-xs inline-flex font-normal text-white/60">
                    <span className={cn(years > 0 && 'text-[#B6FF00]')}>
                      {zeroPad(years, 3)}
                    </span>
                    :
                    <span className={cn(isWeeksGreen && 'text-[#B6FF00]')}>
                      {zeroPad(weeks, 2)}
                    </span>
                    :
                    <span className={cn(isDaysGreen && 'text-[#B6FF00]')}>
                      {zeroPad(days, 2)}
                    </span>
                    :
                    <span className={cn(isHoursGreen && 'text-[#B6FF00]')}>
                      {zeroPad(hours, 2)}
                    </span>
                    :
                    <span className={cn(isMinutesGreen && 'text-[#B6FF00]')}>
                      {zeroPad(minutes, 2)}
                    </span>
                    :
                    <span className={cn(isSecondsGreen && 'text-[#B6FF00]')}>
                      {zeroPad(seconds, 2)}
                    </span>
                  </div>
                )
              }}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center items-end">
        <span className="text-white/60 font-pixel text-xs text-left">
          {lvl} GATE
        </span>
        <span
          className={cn(
            'text-white/60 text-sm text-left',
            p === 1 && 'text-[#FFC800]',
            p === 2 && 'text-[#C4C4C4]',
            p === 3 && 'text-[#C47A49]',
          )}
        >
          #{p}
        </span>
      </div>
    </div>
  )
}

function StatisticsTop100List({ stats }: { stats: GlobalStatisticsData }) {
  return (
    <>
      {stats?.users.map((user, index) => (
        <StatisticsCard
          key={index}
          time={user.time * 1000}
          name={user.nickname ?? user.avatarId.toString()}
          position={index + 1}
          avatarUrl={user.photoUrl}
        />
      ))}
    </>
  )
}
