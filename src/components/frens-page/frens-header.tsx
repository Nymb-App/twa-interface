import { useMemo } from 'react'
import Countdown from 'react-countdown'
import { Skeleton } from '../ui/skeleton'
import { AnimatedCountdown } from '../home-page/progress-section'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import FrensImage from '/frens-img.webp'
import { CountdownTimerDisplay } from '@/components/ui/countdown-timer-display'
import { useAccountMe } from '@/hooks/api/use-account'

export const FrensHeader = ({
  isClaimStart,
  isClaimEnd,
  setIsClaimEnd,
}: {
  isClaimStart: boolean
  isClaimEnd: boolean
  setIsClaimEnd: (value: boolean) => void
}) => {
  const { accountQuery, isLoading } = useAccountMe()

  const accountClaimedTimeMs = useMemo(() => {
    if (!accountQuery.data || !accountQuery.data.claimedTime) return 0
    return accountQuery.data.claimedTime * 1000 // milliseconds
  }, [accountQuery.data])

  const accountClaimedTimeSec = useMemo(() => {
    if (!accountQuery.data || !accountQuery.data.claimedTime) return 0
    return accountQuery.data.claimedTime // seconds
  }, [accountQuery.data])

  const accountClaimTimeSec = useMemo(() => {
    if (!accountQuery.data || !accountQuery.data.claimTime) return 0
    return accountQuery.data.claimTime // seconds
  }, [accountQuery.data])

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
      {isLoading && (
        <div className="flex items-center justify-center gap-6">
          <Skeleton className="h-[68px] w-[50px]" />
          <Skeleton className="h-[68px] w-[50px]" />
          <Skeleton className="h-[68px] w-[50px]" />
          <Skeleton className="h-[68px] w-[50px]" />
          <Skeleton className="h-[68px] w-[50px]" />
        </div>
      )}
      {!isLoading && !accountClaimedTimeMs && !isClaimStart && (
        <CountdownTimerDisplay
          isCountdownHeaderView
          days={0}
          hours={0}
          minutes={0}
          seconds={0}
        />
      )}
      {!isLoading && isClaimEnd && accountClaimedTimeMs > 0 && (
        <Countdown
          date={accountClaimedTimeMs}
          intervalDelay={1000}
          precision={3}
          renderer={(props: any) => (
            <CountdownTimerDisplay isCountdownHeaderView {...props} />
          )}
        />
      )}
      {!isLoading &&
        !isClaimStart &&
        !isClaimEnd &&
        accountClaimedTimeMs > 0 && (
          <Countdown
            date={accountClaimedTimeMs}
            intervalDelay={1000}
            precision={3}
            renderer={(props: any) => (
              <CountdownTimerDisplay isCountdownHeaderView {...props} />
            )}
          />
        )}
      {!isLoading && isClaimStart && !isClaimEnd && (
        <AnimatedCountdown
          from={
            accountClaimedTimeSec > 0
              ? accountClaimedTimeSec
              : Math.floor(Date.now() / 1000)
          }
          to={
            accountClaimTimeSec +
            (accountClaimedTimeSec > 0
              ? accountClaimedTimeSec
              : Math.floor(Date.now() / 1000))
          }
          onEnd={() => setIsClaimEnd(true)}
        />
      )}
    </header>
  )
}
