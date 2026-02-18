/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useAccountMe } from '@/hooks/api/use-account'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { Skeleton } from '../ui/skeleton'
import { gateDataStatistics } from './gate-data-statistics'
import { GateStatisticsInfoBlock } from './ui'

export function GateStatistics() {
  const { getLvlStats, isLoading } = useAccountMe()

  const currentLvl = useMemo(
    () => getLvlStats.data?.currentLevel ?? 12,
    [getLvlStats],
  )

  const statistics = useMemo(() => {
    if (!gateDataStatistics[currentLvl]) {
      return gateDataStatistics['12']
    }
    return gateDataStatistics[currentLvl]
  }, [currentLvl])

  return (
    <section className="font-pixel relative rounded-[32px] border-1 border-white/12 bg-[#161816]/80 p-4 pt-3 text-center font-[400] backdrop-blur-[6px]">
      <h2 className="mb-2 flex items-center justify-center text-[14px] leading-[120%] text-white/40 uppercase">
        you on the
        {isLoading ? (
          <Skeleton className="size-[50px] mx-2" />
        ) : (
          <span
            className={cn(
              'px-4 text-[48px] leading-[120%] text-white',
              currentLvl > 9 && '-ml-5.5',
              currentLvl === 1 && '-ml-5.5',
            )}
          >
            {currentLvl}
          </span>
        )}
        gate level
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-[88px] w-full" />
            <Skeleton className="h-[88px] w-full" />
            <Skeleton className="h-[88px] w-full" />
            <Skeleton className="h-[88px] w-full" />
          </>
        ) : (
          <>
            <GateStatisticsInfoBlock
              value={statistics.dailyReward}
              description="Daily reward"
              unit="d"
            />
            <GateStatisticsInfoBlock
              value={statistics.mining}
              description="Farming"
              unit="h"
            />
            <GateStatisticsInfoBlock
              value={statistics.maxEnergy}
              description="Energy"
              unit="/ day"
            />
            <GateStatisticsInfoBlock
              value={statistics.points}
              description="In Swipe"
              unit="MINUTES"
            />
          </>
        )}
      </div>
    </section>
  )
}
