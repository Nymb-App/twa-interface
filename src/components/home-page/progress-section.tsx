import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { animate } from 'framer-motion'
import Countdown from 'react-countdown'

// Components
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CountdownTimerDisplay } from '../ui/countdown-timer-display'
import { LevelsList } from './levels-list'

// Assets
import EnergyIcon from '@/assets/icons/energy'

// Hooks
import { useAccountMe } from '@/hooks/api/use-account'

// Types
interface AnimatedCountdownProps {
  from: number
  to: number
  onEnd: () => void
}

interface ProgressSectionProps {
  isClaimStart?: boolean
}

interface UserProfileProps {
  username?: string
  photoUrl?: string
}

interface EnergyCounterProps {
  energy?: string | number
}

/**
 * Handles the countdown animation between two timestamps
 */
const AnimatedCountdown = ({ from, to, onEnd }: AnimatedCountdownProps) => {
  const [animatedTime, setAnimatedTime] = useState(from)

  useEffect(() => {
    const controls = animate(from, to, {
      duration: 1.5, // Animation duration in seconds
      ease: 'linear',
      onUpdate: (latest) => setAnimatedTime(latest),
      onComplete: onEnd,
    })
    return () => controls.stop()
  }, [from, to, onEnd])

  return (
    <Countdown
      date={animatedTime * 1000}
      renderer={(props) => (
        <CountdownTimerDisplay isCountdownHeaderView {...props} />
      )}
    />
  )
}

/**
 * Displays the user's energy level
 */
const EnergyCounter = ({ energy }: EnergyCounterProps) => (
  <div className="inline-flex items-center justify-between bg-[#1D1F1D] rounded-2xl h-[40px] pl-2 pr-3">
    <EnergyIcon className="size-[28px]" />
    <span className="text-base">{energy ?? '...'}</span>
  </div>
)

/**
 * Displays the user's profile information
 */
const UserProfile = ({ username, photoUrl }: UserProfileProps) => (
  <div className="inline-flex items-center justify-between gap-2 bg-[#1D1F1D] rounded-2xl h-[40px] pl-2 pr-3">
    <Avatar className="rounded-lg size-[28px]">
      <AvatarImage src={photoUrl ?? 'https://github.com/shadcn.png'} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <span className="font-inter text-base font-semibold max-w-[60px] truncate">
      {username}
    </span>
  </div>
)

/**
 * Custom hook to handle countdown logic
 */
const useCountdownTimer = (isClaimStart: boolean, accountTime?: number) => {
  const [timeBeforeClaim, setTimeBeforeClaim] = useState<number | null>(null)
  const { accountQuery } = useAccountMe()
  const { refetch } = accountQuery

  useEffect(() => {
    // Запускаем refetch при каждом старте клейма
    if (isClaimStart) {
      // Сохраняем время только если оно еще не было сохранено
      if (timeBeforeClaim === null && accountTime !== undefined) {
        setTimeBeforeClaim(accountTime)
      }
      refetch()
    }
  }, [isClaimStart, accountTime, refetch, timeBeforeClaim])

  return { timeBeforeClaim, setTimeBeforeClaim }
}

/**
 * Main ProgressSection component
 */
const ProgressSection = ({ isClaimStart }: ProgressSectionProps) => {
  const { accountQuery, user } = useAccountMe()
  const { data: account, isLoading: isAccountLoading } = accountQuery
  const { timeBeforeClaim, setTimeBeforeClaim } = useCountdownTimer(
    Boolean(isClaimStart),
    account?.time,
  )

  /**
   * Renders the countdown component based on claim state
   */
  const renderCountdown = useCallback(() => {
    const isClaiming = isClaimStart && timeBeforeClaim !== null
    const newTime = account?.time

    // Claim logic
    if (isClaiming) {
      if (newTime !== undefined && newTime > timeBeforeClaim) {
        return (
          <AnimatedCountdown
            from={timeBeforeClaim}
            to={newTime}
            onEnd={() => {
              setTimeBeforeClaim(null)
            }}
          />
        )
      }
      return (
        <Countdown
          date={timeBeforeClaim * 1000}
          renderer={(props) => (
            <CountdownTimerDisplay isCountdownHeaderView {...props} />
          )}
        />
      )
    }

    // Loading state
    if (isAccountLoading || !account?.time) {
      return (
        <CountdownTimerDisplay
          isCountdownHeaderView
          days={0}
          hours={0}
          minutes={0}
          seconds={0}
        />
      )
    }

    // Normal countdown
    return (
      <Countdown
        date={account.time * 1000}
        intervalDelay={10}
        precision={3}
        renderer={(props) => (
          <CountdownTimerDisplay isCountdownHeaderView {...props} />
        )}
      />
    )
  }, [
    isClaimStart,
    timeBeforeClaim,
    account,
    isAccountLoading,
    setTimeBeforeClaim,
  ])

  const headerStyle = useMemo(
    () => ({
      backgroundImage: 'url(/home-bg.webp)',
      contentVisibility: 'auto' as const,
      containIntrinsicSize: '100% 300px',
    }),
    [],
  )

  return (
    <header
      className="relative w-full font-pixel px-3 bg-no-repeat bg-bottom pb-6"
      style={headerStyle}
    >
      <div className="inline-flex justify-between w-full">
        <EnergyCounter energy={account?.energy} />
        <h1 className="text-2xl">HOME</h1>
        <UserProfile username={user?.username} photoUrl={user?.photo_url} />
      </div>

      <LevelsList />
      {renderCountdown()}
    </header>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ProgressSection)
