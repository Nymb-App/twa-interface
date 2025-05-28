import { useCallback, useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import {
  ANIMATION_DURATION_COUNTUP,
  FARMING_DURATION,
  NYMB_FARMING_FINISHAT_LS_KEY,
  useFarming,
} from '../../context/farming-context'
import { ActionButton } from './action-button'
import { cn } from '@/utils'
import { WatchesIcon } from '@/assets/icons/watches'
import { NYMB_FARMING_CLAIM_TIME_KEY } from '@/context/farming-context'

export function FarmingButton({
  className,
  setIsClaimStart,
  setIsClaimEnd,
}: {
  className?: string
  setIsClaimStart?: (value: boolean) => void
  setIsClaimEnd?: (value: boolean) => void
}) {
  const [finishClaimAt, setFinishClaimAt] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [showDefaultButton, setShowDefaultButton] = useState(true)

  const { setFinishAt } = useFarming()

  useEffect(() => {
    const savedFinishAt = localStorage.getItem(NYMB_FARMING_CLAIM_TIME_KEY)
    const savedTime = savedFinishAt ? Number(savedFinishAt) : null

    if (savedTime) {
      if (savedTime > Date.now()) {
        // Таймер еще активен
        setFinishClaimAt(savedTime)
        setShowDefaultButton(false)
        setIsComplete(false)
        setIsClaimStart?.(false)
        setIsClaimEnd?.(false)
      } else {
        // Таймер завершен
        setIsComplete(true)
        setShowDefaultButton(false)
      }
    }
  }, [])

  const handleStart = useCallback(() => {
    const now = Date.now()
    const endTime = now + FARMING_DURATION
    localStorage.setItem(NYMB_FARMING_CLAIM_TIME_KEY, endTime.toString())
    setFinishClaimAt(endTime)
    setIsComplete(false)
    setShowDefaultButton(false)
    setIsClaimStart?.(false)
    setIsClaimEnd?.(false)
  }, [])

  const handleComplete = useCallback(() => {
    setFinishClaimAt(null)
    setIsComplete(true)
    setShowDefaultButton(false)
    setIsClaimStart?.(false)
    setIsClaimEnd?.(false)
  }, [])

  const handleClaimClick = useCallback(() => {
    setShowDefaultButton(true)
    setIsClaimStart?.(true)
    setIsClaimEnd?.(false)
    if (Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)) === 0) {
      setFinishAt(
        Number(
          Date.now() + FARMING_DURATION + ANIMATION_DURATION_COUNTUP + 1000,
        ),
      )
      // setFinishAt(
      //   Number(Date.now() + FARMING_DURATION) + ANIMATION_DURATION_COUNTUP,
      // )
    } else {
      setFinishAt(
        Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)) +
          FARMING_DURATION +
          ANIMATION_DURATION_COUNTUP,
      )
    }
    localStorage.removeItem(NYMB_FARMING_CLAIM_TIME_KEY)
  }, [])

  const renderButton = useCallback(
    (timeStr: string, completed: boolean) => {
      if (completed) {
        return (
          <FarmingClaimButton
            time={timeStr}
            className={className}
            onClick={handleClaimClick}
          />
        )
      }
      return (
        <FarmingProgressButton
          time={timeStr}
          className={className}
          finishAt={finishClaimAt!}
        />
      )
    },
    [className, finishClaimAt, handleClaimClick],
  )

  // if (showDefaultButton && isPendingStart) {
  if (showDefaultButton) {
    return <FarmingDefaultButton className={className} onClick={handleStart} />
  }

  if (isComplete) {
    const actualDuration = FARMING_DURATION

    const hours = String(Math.floor(actualDuration / 3600000)).padStart(2, '0')
    const minutes = String(
      Math.floor((actualDuration % 3600000) / 60000),
    ).padStart(2, '0')
    const seconds = String(
      Math.floor((actualDuration % 60000) / 1000),
    ).padStart(2, '0')
    const timeStr = `${hours}:${minutes}:${seconds}`
    return (
      <FarmingClaimButton
        time={timeStr}
        className={className}
        onClick={handleClaimClick}
      />
    )
  }

  if (!finishClaimAt) {
    return <FarmingDefaultButton className={className} onClick={handleStart} />
  }

  return (
    <Countdown
      date={finishClaimAt}
      onComplete={handleComplete}
      renderer={({ hours, minutes, seconds, completed }) => {
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        return renderButton(timeStr, completed)
      }}
    />
  )
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
  time: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-[56px] p-2 inline-flex justify-center items-center gap-1 font-pixel text-lg text-[#B6FF00] rounded-xl bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00]',
        className,
      )}
    >
      <span className="mix-blend-difference">CLAIM</span>
      <WatchesIcon className="mix-blend-difference" fill="#B6FF00" />
      <span className="mix-blend-difference">{time}</span>
    </button>
  )
}

function FarmingProgressButton({
  className,
  time,
  finishAt,
}: {
  className?: string
  time: string
  finishAt: number
}) {
  const totalDuration = FARMING_DURATION
  const timeLeft = finishAt - Date.now()
  const progressPercent = Math.max(
    0,
    Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100),
  )

  return (
    <button
      disabled
      className={cn(
        'relative h-[56px] overflow-hidden flex flex-col justify-center items-center cursor-pointer font-pixel text-lg text-[#B6FF00] rounded-xl bg-[#222a13] active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed',
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
        <span className="mix-blend-difference">{time}</span>
      </div>
    </button>
  )
}
