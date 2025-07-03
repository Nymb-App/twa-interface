import { useCallback, useEffect, useMemo, useState } from 'react'
import Countdown from 'react-countdown'
import { LoaderIcon } from 'lucide-react'
import {
  ANIMATION_DURATION_COUNTUP,
  FARMING_DURATION,
  FARMING_REWARD,
  NYMB_FARMING_FINISHAT_LS_KEY,
  useFarming,
} from '../../context/farming-context'
import { ActionButton } from './action-button'
import { cn } from '@/utils'
import { WatchesIcon } from '@/assets/icons/watches'
import { NYMB_FARMING_CLAIM_TIME_KEY } from '@/context/farming-context'
import { useFarming as useFarmingApi } from '@/hooks/api/use-farming'

export function FarmingButton({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  const [isFarming, setIsFarming] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)

  const { setFinishAt } = useFarming()
  const { farmingStatusQuery, startFarming, claimReward } = useFarmingApi()

  const duration = useMemo(() => {
    if (!farmingStatusQuery.data) return FARMING_DURATION
    return farmingStatusQuery.data.duration * 1000
  }, [farmingStatusQuery.data])

  const startedAt = useMemo(() => {
    if (!farmingStatusQuery.data) return 0
    return farmingStatusQuery.data.startedAt * 1000
  }, [farmingStatusQuery.data])

  const reward = useMemo(() => {
    if (!farmingStatusQuery.data) return FARMING_REWARD
    return farmingStatusQuery.data.reward * 1000
  }, [farmingStatusQuery.data])

  useEffect(() => {
    if (!startedAt && !isClaiming) return

    if (startedAt > 0 && Date.now() < startedAt + duration) {
      setIsFarming(true)
    }

    if (reward > 0 && Date.now() >= startedAt + duration) {
      setIsClaiming(true)
    }
  }, [startedAt, duration, reward])

  const handleStart = useCallback(() => {
    setIsFarming(true)
    startFarming(undefined, {
      onSuccess: () => {
        farmingStatusQuery.refetch()
      },
      onError: () => {
        setIsFarming(false)
      },
    })
  }, [startFarming, farmingStatusQuery])

  const handleClaimClick = useCallback(() => {
    setIsClaiming(false)
    claimReward(undefined, {
      onSuccess: () => {
        onClick?.()
        if (Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)) === 0) {
          setFinishAt(
            Number(Date.now() + duration + ANIMATION_DURATION_COUNTUP + 1000),
          )
        } else {
          setFinishAt(
            Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)) +
              duration +
              ANIMATION_DURATION_COUNTUP,
          )
        }
        localStorage.removeItem(NYMB_FARMING_CLAIM_TIME_KEY)
      },
    })
  }, [onClick, setFinishAt, claimReward])

  if (!isFarming && !isClaiming) {
    return <FarmingDefaultButton className={className} onClick={handleStart} />
  }

  if (isFarming && startedAt === 0) {
    return <FarmingDefaultLoadingButton className={className} />
  }

  if (isFarming && startedAt > 0) {
    return (
      <FarmingProgressButton
        startAt={startedAt}
        duration={duration}
        className={className}
        onComplete={() => {
          setIsFarming(false)
          setIsClaiming(true)
        }}
      />
    )
  }

  if (isClaiming) {
    return (
      <FarmingClaimButton
        time={reward}
        className={className}
        onClick={handleClaimClick}
      />
    )
  }
}

function FarmingDefaultButton({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <ActionButton onClick={onClick} className={cn(className)}>
      <WatchesIcon className="mix-blend-difference" fill="#B6FF00" />
      <span className="mix-blend-difference">START FARMING</span>
    </ActionButton>
  )
}

function FarmingClaimButton({
  className,
  time,
  onClick,
}: {
  className?: string
  time: number
  onClick?: () => void
}) {
  const hours = String(Math.floor(time / 3600000)).padStart(2, '0')
  const minutes = String(Math.floor((time % 3600000) / 60000)).padStart(2, '0')
  const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0')
  const timeStr = `${hours}:${minutes}:${seconds}`

  return (
    <button
      onClick={onClick}
      className={cn(
        'h-[56px] p-2 inline-flex justify-center items-center gap-1 font-pixel text-lg text-[#B6FF00] rounded-[16px] bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00]',
        className,
      )}
    >
      <span className="mix-blend-difference">CLAIM</span>
      <WatchesIcon className="mix-blend-difference" fill="#B6FF00" />
      <span className="mix-blend-difference">{timeStr}</span>
    </button>
  )
}

function FarmingProgressButton({
  className,
  startAt,
  duration,
  onComplete,
}: {
  className?: string
  startAt: number
  duration: number
  onComplete?: () => void
}) {
  return (
    <Countdown
      intervalDelay={1000}
      onComplete={onComplete}
      renderer={({ hours, minutes, seconds }) => {
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        const elapsedTime = Date.now() - startAt
        const progressPercent = Math.floor(
          Math.max(0, Math.min(100, (elapsedTime / duration) * 100)),
        )
        return (
          <button
            disabled
            className={cn(
              'relative h-[56px] overflow-hidden flex flex-col justify-center items-center cursor-pointer font-pixel text-lg text-[#B6FF00] rounded-[16px] bg-[#B6FF00]/8 active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed',
              className,
            )}
          >
            <div
              className="absolute inset-0 rounded-[16px] bg-gradient-to-b from-[#ADFA4B] from-20% to-[#B6FF00] transition-[width] ease-linear duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="relative z-10 inline-flex items-center gap-1 active:text-[#B6FF00] mix-blend-difference">
              <span className="mix-blend-difference">FARMING</span>
              <WatchesIcon className="mix-blend-difference" fill="#B6FF00" />
              <span className="mix-blend-difference">{timeStr}</span>
            </div>
          </button>
        )
      }}
      date={startAt + duration}
    />
  )
}

function FarmingDefaultLoadingButton({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <ActionButton
      onClick={onClick}
      className={cn(
        'bg-[#B6FF00]/8 active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed',
        className,
      )}
      disabled
    >
      <LoaderIcon
        className="mix-blend-difference animate-spin"
        fill="#B6FF00"
      />
      <span className="mix-blend-difference uppercase ml-2">loading</span>
    </ActionButton>
  )
}
