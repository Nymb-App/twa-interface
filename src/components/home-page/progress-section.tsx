import { animate } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Countdown from 'react-countdown'

// Components
import { Link } from '@tanstack/react-router'
import { TbReload } from 'react-icons/tb'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CountdownTimerDisplay } from '../ui/countdown-timer-display'
import { Skeleton } from '../ui/skeleton'
import { LevelsList } from './levels-list'

// Assets
import EnergyIcon from '@/assets/icons/energy'

// Hooks
import EnergyEmptyIcon from '@/assets/icons/energy-empty'
import { useAccountMe } from '@/hooks/api/use-account'
import { cn } from '@/lib/utils'
import TicketsIcon from '@/assets/icons/tickets'
import { LangSwitch } from './lang-switch'

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

interface TicketsCounterProps {
  tickets?: string | number
}

/**
 * Handles the countdown animation between two timestamps
 */
export const AnimatedCountdown = ({
  from,
  to,
  onEnd,
}: AnimatedCountdownProps) => {
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
  <div
    className={cn(
      'inline-flex items-center justify-between bg-[#1d1f1d] rounded-2xl h-[40px] pl-2 pr-3',
      energy === 0 && 'pl-0 pr-0 px-2',
    )}
  >
    {energy === 0 ? (
      <Link to="/shop" className="inline-flex items-center gap-1">
        <EnergyEmptyIcon className="size-[16px]" />
        <div className="relative">
          <TbReload className="size-5 text-[#A45FFF] scale-x-[-1] rounded-full" />
          <TbReload className="size-5 text-[#A45FFF] blur scale-x-[-1] rounded-full absolute left-1/2 top-1/2 -translate-1/2" />
        </div>
      </Link>
    ) : (
      <>
        <EnergyIcon className="size-[28px]" />
        <span className="text-base text-[#A45FFF] [text-shadow:0px_0px_12px_#9C1FFD]">
          {energy ?? '...'}
        </span>
      </>
    )}
  </div>
)


const TicketsCounter = ({ tickets }: TicketsCounterProps) => (
  <div
    className={cn(
      'inline-flex items-center justify-between bg-[#1d1f1d] rounded-2xl h-[40px] pl-2 pr-3',
      tickets === 0 && 'pl-0 pr-0 px-2',
    )}
  >
    {tickets === 0 ? (
      <Link to="/shop" className="inline-flex items-center gap-1">
        <EnergyEmptyIcon className="size-[16px]" />
        <div className="relative">
          <TbReload className="size-5 text-[#FBB107] scale-x-[-1] rounded-full" />
          <TbReload className="size-5 text-[#FBB107] blur scale-x-[-1] rounded-full absolute left-1/2 top-1/2 -translate-1/2" />
        </div>
      </Link>
    ) : (
      <>
        <TicketsIcon className="size-[28px]" />
        <span className="text-base text-[#FBB107] [text-shadow:0px_0px_12px_#FBB107]">
          {tickets ?? '...'}
        </span>
      </>
    )}
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
export const ProgressSection = ({ isClaimStart }: ProgressSectionProps) => {
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

    if (isAccountLoading) {
      return (
        <div className="flex items-center justify-center gap-6">
          <Skeleton className="h-[68px] w-[50px]" />
          <Skeleton className="h-[68px] w-[50px]" />
          <Skeleton className="h-[68px] w-[50px]" />
          <Skeleton className="h-[68px] w-[50px]" />
          <Skeleton className="h-[68px] w-[50px]" />
        </div>
      )
    }

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
    if (!account?.time) {
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
      className="relative w-full font-pixel px-3 bg-no-repeat bg-bottom pb-5"
      style={headerStyle}
    >
      <div className="inline-flex justify-between w-full">
        <div className='inline-flex gap-2 items-center'>
          <EnergyCounter energy={account?.energy} />
          <TicketsCounter tickets={account?.ticket} />
        </div>
        
        <div className='inline-flex gap-2 items-center'>
          <LangSwitch />
          <UserProfile username={user?.username} photoUrl={user?.photo_url} />
        </div>
      </div>

      <LevelsList />
      {renderCountdown()}
    </header>
  )
}
