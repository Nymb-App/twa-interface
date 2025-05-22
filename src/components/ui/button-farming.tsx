import { useCallback, useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { cn } from '@/utils'
import { WatchesIcon } from '@/assets/icons/watches'

const LOCAL_STORAGE_CURRENT_TIMER_COUNT_KEY = 'nymb-farming-finishat'
const LOCAL_STORAGE_SAVED_COMPLETED_TIME_KEY = 'nymb-farming-duration'
const FARMING_DURATION = 20 * 1000

export function FarmingButton({ className }: { className?: string }) {
  const [finishAt, setFinishAt] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [startAt, setStartAt] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CURRENT_TIMER_COUNT_KEY)
    const savedTime = saved ? Number(saved) : null
    if (savedTime && savedTime > Date.now()) {
      setFinishAt(savedTime)
      setStartAt(savedTime - FARMING_DURATION)
    } else if (savedTime) {
      setIsComplete(true)
    }
  }, [])

  const handleStart = useCallback(() => {
    const now = Date.now()
    const endTime = now + FARMING_DURATION
    localStorage.setItem(
      LOCAL_STORAGE_CURRENT_TIMER_COUNT_KEY,
      endTime.toString(),
    )
    setFinishAt(endTime)
    setStartAt(now)
    setIsComplete(false)
  }, [])

  const handleComplete = useCallback(() => {
    if (startAt) {
      const duration = Date.now() - startAt
      localStorage.setItem(
        LOCAL_STORAGE_SAVED_COMPLETED_TIME_KEY,
        duration.toString(),
      )
    }
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_TIMER_COUNT_KEY)
    setFinishAt(null)
    setStartAt(null)
    setIsComplete(true)
  }, [startAt])

  const renderButton = useCallback(
    (timeStr: string, completed: boolean) => {
      if (completed) {
        return (
          <FarmingClaimButton
            time={timeStr}
            className={className}
            onClick={handleStart}
          />
        )
      }
      return (
        <FarmingProgressButton
          time={timeStr}
          className={className}
          finishAt={finishAt!}
        />
      )
    },
    [className, handleStart, finishAt],
  )

  if (isComplete) {
    const savedDuration = localStorage.getItem(
      LOCAL_STORAGE_SAVED_COMPLETED_TIME_KEY,
    )
    const duration = savedDuration ? Number(savedDuration) : 0
    const hours = String(Math.floor(duration / 3600000)).padStart(2, '0')
    const minutes = String(Math.floor((duration % 3600000) / 60000)).padStart(
      2,
      '0',
    )
    const seconds = String(Math.floor((duration % 60000) / 1000)).padStart(
      2,
      '0',
    )
    const timeStr = `${hours}:${minutes}:${seconds}`

    return (
      <FarmingClaimButton
        time={timeStr}
        className={className}
        onClick={handleStart}
      />
    )
  }

  if (!finishAt) {
    return <FarmingDefaultButton className={className} onClick={handleStart} />
  }

  return (
    <Countdown
      date={finishAt}
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
    <button
      onClick={onClick}
      className={cn(
        'h-[56px] p-2 inline-flex justify-center items-center gap-1 font-pixel text-lg text-[#B6FF00] rounded-xl bg-gradient-to-b cursor-pointer from-[#ADFA4B] to-[#B6FF00]',
        className,
      )}
    >
      <WatchesIcon className="mix-blend-difference" fill="#B6FF00" />
      <span className="mix-blend-difference">START FARMING</span>
    </button>
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
