import { useMemo } from 'react'
import { Skeleton } from '../ui/skeleton'
import { GateStatisticsInfoBlock } from './ui'
import { cn, convertTimestampToDaysUnit } from '@/utils'
import { useAccountMe } from '@/hooks/api/use-account'

export function GateStatistics() {
  const { getLvlStats, isLoading } = useAccountMe()

  const currentLvl = useMemo(
    () => getLvlStats.data?.currentLevel ?? 12,
    [getLvlStats],
  )

  const currentLvlBenefits = useMemo(() => {
    if (getLvlStats.data?.currentLvlBenefits) {
      return getLvlStats.data.currentLvlBenefits
    }
    return {
      minigameSlidePoints: 1,
      minigameBattleTime: 86400,
      farmingTime: 21600,
      dailyReward: 86400,
    }
  }, [getLvlStats])

  return (
    <section className="font-pixel relative rounded-[32px] border-1 border-white/12 bg-[#161816]/80 p-4 pt-3 text-center font-[400] backdrop-blur-[6px]">
      <h2 className="mb-2 flex items-center justify-center text-[14px] leading-[120%] text-white/40 uppercase">
        you on the
        <span
          className={cn(
            'px-4 text-[48px] leading-[120%] text-white',
            currentLvl > 9 && '-ml-5.5',
            currentLvl === 1 && '-ml-5.5',
          )}
        >
          {currentLvl}
        </span>
        gate level
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          <Skeleton className="h-[88px] w-full" />
        ) : (
          <GateStatisticsInfoBlock
            value={convertTimestampToDaysUnit(currentLvlBenefits.dailyReward)}
            description="Daily reward"
            unit="d"
            isConvertSeconds={false}
          />
        )}

        {isLoading ? (
          <Skeleton className="h-[88px] w-full" />
        ) : (
          <GateStatisticsInfoBlock
            value={currentLvlBenefits.farmingTime * 1000}
            description="Mining"
          />
        )}
        {isLoading ? (
          <Skeleton className="h-[88px] w-full" />
        ) : (
          <GateStatisticsInfoBlock
            value={convertTimestampToDaysUnit(
              currentLvlBenefits.minigameBattleTime,
            )}
            description="in Battle"
            isZeroPad={false}
            isConvertSeconds={false}
            unit="/ day"
          />
        )}
        {isLoading ? (
          <Skeleton className="h-[88px] w-full" />
        ) : (
          <GateStatisticsInfoBlock
            value={currentLvlBenefits.minigameSlidePoints}
            description="In Swipe"
            isZeroPad={false}
            unit="points"
            isConvertSeconds={false}
          />
        )}
      </div>
    </section>
  )
}
