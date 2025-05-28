import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { zeroPad } from 'react-countdown'
import { cn } from '@/utils'
import { ANIMATION_DURATION_COUNTUP } from '@/context/farming-context'

const CountupDisplayBlock = ({
  label,
  value,
  isFirst,
  minutesValue,
}: {
  label: string
  value: number
  isFirst: boolean
  minutesValue?: number
}) => {
  const forceGreenForSeconds =
    label === 'Seconds' && minutesValue && minutesValue !== 0

  const colorClass =
    value === 0 && !forceGreenForSeconds
      ? 'text-[#FFFFFF]/40 font-[400] text-[30px]'
      : 'font-[400] text-[30px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]'

  return (
    <div
      className={`w-[50px] text-center relative ${
        !isFirst &&
        'before:content-[":"] before:text-[30px] before:absolute before:-left-[25px] before:top-[22px] before:-translate-y-1/2 before:text-gray-500'
      }`}
    >
      <p
        className={cn(
          'leading-[120%] mb-2',
          colorClass,
          value > 9 && value <= 19 && 'pr-3',
        )}
      >
        {zeroPad(value)}
      </p>
      <p className="text-[10px] font-[400] uppercase text-[#FFFFFF]/40">
        {label}
      </p>
    </div>
  )
}

function formatTime(msElapsed: number) {
  const totalSeconds = Math.floor(msElapsed / 1000)

  const weeks = Math.floor(totalSeconds / (7 * 24 * 3600))
  const days = Math.floor((totalSeconds % (7 * 24 * 3600)) / (24 * 3600))
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    weeks,
    days,
    hours,
    minutes,
    seconds,
  }
}

export const TimeCountup = ({
  initialFinishAtValue,
  totalEarnings,
  targetTimestamp,
  isClaimStart,
  setIsClaimEnd,
}: {
  initialFinishAtValue: number
  totalEarnings: number
  targetTimestamp: number
  isClaimStart: boolean
  setIsClaimEnd: (value: boolean) => void
}) => {
  const now = Date.now()
  const initialRemaining =
    initialFinishAtValue > 0
      ? targetTimestamp - now - totalEarnings > 0
        ? targetTimestamp - now - totalEarnings
        : 0
      : 0
  const totalDurationMs = targetTimestamp - now

  const [elapsed, setElapsed] = useState(initialRemaining)

  useEffect(() => {
    const animation = animate(
      initialRemaining,
      totalDurationMs - ANIMATION_DURATION_COUNTUP,
      {
        duration: ANIMATION_DURATION_COUNTUP / 1000,
        ease: 'linear',
        onUpdate: (latest) => {
          setElapsed(latest)
        },
        onComplete: () => {
          setIsClaimEnd(true)
        },
      },
    )
    return () => animation.stop()
  }, [isClaimStart])

  const { weeks, days, hours, minutes, seconds } = formatTime(elapsed)

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const blocks = [
    { label: 'Weeks', value: weeks },
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ]

  return (
    <motion.div
      className="flex justify-center gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {blocks.map((item, idx) => (
        <CountupDisplayBlock
          key={idx}
          label={item.label}
          value={item.value}
          isFirst={idx === 0}
        />
      ))}
    </motion.div>
  )
}
