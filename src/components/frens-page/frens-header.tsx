import { useState } from 'react'
import Countdown from 'react-countdown'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import FrensImage from '/frens-img.webp'
import { CountdownTimerDisplay } from '@/components/ui/countdown-timer-display'
import { TimeCountup } from '@/components/ui/countup-timer-display'
import {
  NYMB_FARMING_FINISHAT_LS_KEY,
  useFarming,
} from '@/context/farming-context'

export const FrensHeader = ({
  isClaimStart,
  isClaimEnd,
  setIsClaimEnd,
}: {
  isClaimStart: boolean
  isClaimEnd: boolean
  setIsClaimEnd: (value: boolean) => void
}) => {
  const { finishAt, loading } = useFarming()

  const [initialFinishAtValue, _] = useState(
    Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)),
  )
  const totalEarnings = 1610000

  return (
    <header className="font-pixel relative w-full bg-[url('/frens-bg.webp')] bg-bottom bg-no-repeat px-3 pb-6 font-[400]">
      <img
        src={FrensImage}
        alt="preview-image"
        width={191}
        height={155}
        className="-mt-[20px] translate-x-1/2 animate-[wiggle_3s_ease-in-out_infinite]"
      />
      <FlickeringGrid
        className="absolute inset-0 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="#b7ff01"
        maxOpacity={1}
        flickerChance={0.3}
        autoResize={false}
        width={450}
        height={250}
      />
      <h1 className="mb-6 text-center text-[24px] leading-8 uppercase">
        Invite frens
        <br />
        and get more time
      </h1>
      <p className="font-inter mb-2 text-center text-[14px] leading-[140%] text-[#FFFFFF99]">
        Total Earnings:
      </p>
      {loading && <div>loading...</div>}
      {finishAt > 0 && !isClaimStart && (
        <Countdown
          date={finishAt}
          intervalDelay={10}
          precision={3}
          renderer={(props: any) => (
            <CountdownTimerDisplay isCountdownHeaderView {...props} />
          )}
        />
      )}
      {!loading && !finishAt && !isClaimStart && (
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
          totalEarnings={totalEarnings}
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
