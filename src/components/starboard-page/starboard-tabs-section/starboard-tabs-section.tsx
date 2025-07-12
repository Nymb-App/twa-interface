/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { useState } from 'react'
import { StarboardTopRateBlock } from './starboard-top-rate-block/starboard-top-rate-block'
import { StarboardPersonalRateBlock } from './starboard-personal-rate-block/starboard-personal-rate-block'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { useStatistics } from '@/hooks/api/use-statistics'
import { useLvl } from '@/hooks/use-lvl'
import { cn } from '@/utils'
import { NoTasksBlock } from '@/components/tasks-page/tasks-tabs/tasks-tabs'
import { Skeleton } from '@/components/ui/skeleton'

export const StarboardTabsSection = () => {
  const { lvls, maxLvl } = useLvl()
  const { globalStatistics } = useStatistics()
  const [activeLvl, setActiveLvl] = useState<number>(maxLvl)

  return (
    <Tabs
      defaultValue={String(activeLvl)}
      value={String(activeLvl)}
      onValueChange={(value) => {
        const newLvl = Number(value)
        setActiveLvl(newLvl)
        globalStatistics.loadLevel(newLvl)
      }}
      className="-mt-[10px] h-full flex-1 flex flex-col"
    >
      <TabsList className="mb-4 pl-3">
        <Carousel opts={{ slidesToScroll: 4 }}>
          <CarouselContent className="flex gap-2 mr-7">
            {lvls.map((item, idx) => (
              <CarouselItem key={idx} className="basis-[80px] flex">
                <TabsTrigger
                  value={String(item)}
                  className="data-[state=active]:bg-[#B6FF00] data-[state=active]:text-[#121312] h-[30px] w-[80px] py-2 px-2.5 shrink-0 bg-[#FFFFFF14] rounded-[64px] text-[#FFFFFF] font-pixel font-[400] text-[12px] leading-[120%] uppercase"
                >
                  {item} gate
                </TabsTrigger>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </TabsList>

      <div className="flex flex-col flex-1 px-4">
        <StarboardPersonalRate />
        {lvls.map((lvl) => {
          const levelData = globalStatistics.data[lvl]
          const isLoading = !levelData && globalStatistics.isLoading

          return (
            <TabsContent
              key={lvl}
              value={String(lvl)}
              className={cn(
                'flex flex-col gap-2 flex-1',
                (isLoading || !levelData?.users.length) &&
                  'justify-center items-center',
              )}
            >
              {isLoading ? (
                <div className="w-full space-y-2 mt-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : levelData?.users.length > 0 ? (
                <>
                  <h2 className="text-[#FFFFFF] font-[400] leading-[24px] text-[18px] font-pixel mt-8 ml-4">
                    Top 100 users
                  </h2>
                  {levelData.users.map((user, idx) => (
                    <StarboardTopRateBlock
                      key={user.telegramId}
                      gateUserData={{
                        name: user.nickname || 'Unknown',
                        time: user.time,
                        photoUrl: user.photoUrl,
                      }}
                      idx={idx}
                    />
                  ))}
                </>
              ) : (
                <NoTasksBlock
                  className="h-full flex-1"
                  title="NO USER"
                  subtitle="ON THIS GATE"
                />
              )}
            </TabsContent>
          )
        })}
      </div>
    </Tabs>
  )
}

function StarboardPersonalRate() {
  const { myStatistics } = useStatistics()

  if (myStatistics.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (myStatistics.isError) {
    return <div>Error loading personal statistics</div>
  }

  const data = myStatistics.data || {
    lvl: 0,
    place: 0,
    time: 0,
    energy: 0,
  }

  return (
    <StarboardPersonalRateBlock
      gateCurrentUserData={{
        gate: data.lvl,
        ratePosition: data.place,
        time: data.time,
      }}
    />
  )
}
