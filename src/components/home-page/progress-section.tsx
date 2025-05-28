import Countdown from 'react-countdown'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CountdownTimerDisplay } from '../ui/countdown-timer-display'
import { TimeCountup } from '../ui/countup-timer-display'
import { LevelsList } from './levels-list'
import EnergyIcon from '@/assets/icons/energy'
import {
  FARMING_DURATION,
  NYMB_FARMING_FINISHAT_LS_KEY,
  useFarming,
} from '@/context/farming-context'

const ProgressSection = ({
  isClaimStart,
  isClaimEnd,
  setIsClaimEnd,
}: {
  isClaimStart?: boolean
  isClaimEnd?: boolean
  setIsClaimEnd: (value: boolean) => void
}) => {
  const { finishAt, loading } = useFarming()
  const [initialFinishAtValue, _] = useState(
    Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)),
  )

  return (
    <header className="relative w-full font-pixel px-3 bg-[url('/home-bg.png')] bg-no-repeat bg-bottom pb-6">
      {/* Top part */}
      <div className="inline-flex justify-between w-full">
        {/* Left card */}
        <div className="inline-flex items-center justify-between bg-[#1D1F1D] rounded-2xl h-[40px] pl-2 pr-3">
          <EnergyIcon className="size-[28px]" />
          <span className="text-base">1000</span>
        </div>

        <h1 className="text-2xl">HOME</h1>

        {/* Right card */}
        <div className="inline-flex items-center justify-between gap-2 bg-[#1D1F1D] rounded-2xl h-[40px] pl-2 pr-3">
          <Avatar className="rounded-lg size-[28px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className=" font-inter text-base font-semibold">tevil</span>
        </div>
      </div>
      <LevelsList />
      {loading && <div>loading...</div>}
      {finishAt > 0 && !isClaimStart && !isClaimEnd && (
        <Countdown
          date={finishAt}
          intervalDelay={10}
          precision={3}
          renderer={(props: any) => (
            <CountdownTimerDisplay isCountdownHeaderView {...props} />
          )}
        />
      )}
      {!loading && !finishAt && !isClaimStart && !isClaimEnd && (
        <CountdownTimerDisplay
          isCountdownHeaderView
          days={0}
          hours={0}
          minutes={0}
          seconds={0}
        />
      )}
      {finishAt > 0 && isClaimEnd && (
        <Countdown
          date={finishAt}
          intervalDelay={10}
          precision={3}
          renderer={(props: any) => (
            <CountdownTimerDisplay isCountdownHeaderView {...props} />
          )}
        />
      )}

      {isClaimStart && !isClaimEnd && (
        <TimeCountup
          initialFinishAtValue={initialFinishAtValue}
          totalEarnings={FARMING_DURATION}
          targetTimestamp={Number(
            localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY),
          )}
          isClaimStart={isClaimStart}
          setIsClaimEnd={setIsClaimEnd}
        />
      )}
    </header>
  )
}

export default ProgressSection
