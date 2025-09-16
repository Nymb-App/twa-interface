import Marquee from 'react-fast-marquee'
import { useMemo } from 'react'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { Skeleton } from '../ui/skeleton'
import { GateNextDisplayBlock } from './gate-next-display-block'
import { GateProgressDisplay } from './gate-progress-display'
import { GateStatistics } from './gate-statistics'
import { useAccountMe } from '@/hooks/api/use-account'
import { cn, convertTimestampToDaysUnit } from '@/utils'
import { ArrowIcon } from '@/assets/icons/arrow'

export const GateMainSection = () => {
  const { getLvlStats, accountQuery, isLoading } = useAccountMe()

  const currentLvl = useMemo(
    () => getLvlStats.data?.currentLevel ?? 12,
    [getLvlStats],
  )

  const isNextLvlUnlocked = useMemo(
    () => getLvlStats.data?.isNextLvlUnlocked ?? false,
    [getLvlStats],
  )

  const accountData = useMemo(() => accountQuery.data, [accountQuery])

  const timeLeft = useMemo(() => {
    if (accountData?.time) {
      return accountData.time * 1000 - Date.now() > 0
        ? Math.floor((accountData.time * 1000 - Date.now()) / 1000)
        : 0
    }
    return 0
  }, [accountQuery])

  return (
    <div className="px-4">
      <div className="relative flex items-center px-2 justify-between pb-[56px]">
        <FlickeringGrid
          className="absolute -top-[120px] h-[345px] mask-[radial-gradient(ellipse_200px_200px_at_center,black,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#FFFFFF"
          maxOpacity={0.7}
          flickerChance={0.3}
          autoResize={false}
          width={450}
        />
        <MarqueeVertical className="absolute top-[260px] left-1/2 h-[350px] w-[46px] -translate-x-1/2 -translate-y-1/2" />
        {isLoading ? (
          <Skeleton className="w-[68px] h-[115px]" />
        ) : (
          <GateProgressDisplay
            icon={<img src="/clock-img.webp" className="size-10" />}
            current={convertTimestampToDaysUnit(timeLeft)}
            max={convertTimestampToDaysUnit(
              getLvlStats.data?.timeRequired ?? 1,
            )}
            label="days"
          />
        )}
        {isLoading ? (
          <Skeleton className="absolute left-1/2 z-1 -translate-x-1/2 size-[88px] rounded-[32px]" />
        ) : (
          <GateNextDisplayBlock
            className="absolute left-1/2 z-1 -translate-x-1/2"
            isLockedNewGate={!isNextLvlUnlocked}
            currentLevel={currentLvl}
          />
        )}
        {isLoading ? (
          <Skeleton className="w-[68px] h-[115px]" />
        ) : (
          <GateProgressDisplay
            icon={<img src="/ticket-img.webp" className="size-10" />}
            current={accountData?.ticket ?? 0}
            max={getLvlStats.data?.ticketsRequired ?? 1}
            label="ticket"
          />
        )}
      </div>
      <GateStatistics />
    </div>
  )
}

const MarqueeVertical = ({ className }: { className?: string }) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute size-full bg-[#B6FF00]/15 blur-[8px]" />
      <div className="absolute left-1/2 h-full w-[4px] -translate-x-1/2 bg-[#B6FF00]/15 blur-[3px]" />
      <Marquee
        speed={2}
        className="absolute top-1/2 left-1/2 !w-[350px] -translate-x-1/2 -translate-y-1/2 rotate-90"
      >
        <ArrowIcon className="h-[15px] w-[15px] rotate-180 text-[#B6FF00]" />
      </Marquee>
    </div>
  )
}
