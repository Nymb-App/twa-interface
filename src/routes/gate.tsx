import { createFileRoute } from '@tanstack/react-router'
import Marquee from 'react-fast-marquee'
import { useMemo } from 'react'
import { PageLayout } from '@/components/ui/page-layout'
import { WatchesIcon } from '@/assets/icons/watches'
import {
  GateNextDisplayBlock,
  GateProgressDisplay,
} from '@/components/gate-page/gate-header'
import { TicketIcon } from '@/assets/icons/ticket'
import { cn, convertTimestampToDaysUnit } from '@/utils'
import { ArrowIcon } from '@/assets/icons/arrow'
import { GateStatisticsInfoBlock } from '@/components/gate-page/ui/info-block'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { useAccountMe } from '@/hooks/api/use-account'

export const Route = createFileRoute('/gate')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout useFooter={false} useJumpToTheNextGateButton={true}>
      <header className="relative text-center font-[400]">
        <h1 className="font-pixel mb-2 text-[24px] leading-[32px] text-[#FFFFFF] uppercase">
          gates
        </h1>
        <p className="font-inter mb-4 text-[14px] leading-[140%] text-[#FFFFFF]/60">
          Upgrade gat levels to get more rewards. <br /> Lower the level, the
          closer you are to the main <br /> reward - airdrop
        </p>
      </header>
      <MainSection />
    </PageLayout>
  )
}

const MainSection = () => {
  const { getLvlStats, accountQuery } = useAccountMe()

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
        <GateProgressDisplay
          icon={<WatchesIcon />}
          current={convertTimestampToDaysUnit(timeLeft)}
          max={convertTimestampToDaysUnit(getLvlStats.data?.timeRequired ?? 1)}
          label="days"
        />
        <GateNextDisplayBlock
          className="absolute left-1/2 z-1 -translate-x-1/2"
          isLockedNewGate={isNextLvlUnlocked}
          currentLevel={currentLvl}
        />
        <GateProgressDisplay
          icon={<TicketIcon className="h-[45px] w-[45px]" />}
          current={accountData?.ticket ?? 0}
          max={getLvlStats.data?.ticketsRequired ?? 1}
          label="ticket"
        />
      </div>
      <Statistics />
    </div>
  )
}

function Statistics() {
  const { getLvlStats } = useAccountMe()

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
        <GateStatisticsInfoBlock
          value={convertTimestampToDaysUnit(currentLvlBenefits.dailyReward)}
          description="Daily reward"
          unit="d"
          isConvertSeconds={false}
        />
        <GateStatisticsInfoBlock
          value={currentLvlBenefits.farmingTime * 1000}
          description="Mining"
        />
        <GateStatisticsInfoBlock
          value={convertTimestampToDaysUnit(
            currentLvlBenefits.minigameBattleTime,
          )}
          description="in Battle"
          isZeroPad={false}
          isConvertSeconds={false}
          unit="/ day"
        />
        <GateStatisticsInfoBlock
          value={currentLvlBenefits.minigameSlidePoints}
          description="In Swipe"
          isZeroPad={false}
          unit="points"
          isConvertSeconds={false}
        />
      </div>
    </section>
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
