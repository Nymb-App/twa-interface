import { zeroPad } from 'react-countdown'
import { cn, formatTimeParts } from '@/utils'

const CountdownBlock = ({
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
      className={`w-[50px] relative ${
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

export const CountdownTimerDisplay = ({
  isCountdownHeaderView = false,
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  isCountdownHeaderView?: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}) => {
  if (completed) {
    const blocks = [
      { label: 'Weeks', value: 0 },
      { label: 'Days', value: 0 },
      { label: 'Hours', value: 0 },
      { label: 'Minutes', value: 0 },
      { label: 'Seconds', value: 0 },
    ]
    return isCountdownHeaderView ? (
      <div className="text-center">
        <div className="flex justify-center gap-6">
          {blocks.map((item, index) => (
            <CountdownBlock
              key={item.label}
              label={item.label}
              value={item.value}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="font-pixel font-[400] text-[12px] leading-[120%] mt-1 text-[#FFFFFF99]">
        00:00:00:00:00:00
      </div>
    )
  }

  if (isCountdownHeaderView) {
    const computedWeeks = Math.floor(days / 7)
    const remainingDays = days % 7
    const blocks = [
      { label: 'Weeks', value: computedWeeks },
      { label: 'Days', value: remainingDays },
      { label: 'Hours', value: hours },
      { label: 'Minutes', value: minutes },
      { label: 'Seconds', value: seconds },
    ]

    return (
      <div className="text-center">
        <div className="flex justify-center gap-6">
          {blocks.map((item, index) => (
            <CountdownBlock
              key={item.label}
              label={item.label}
              value={item.value}
              isFirst={index === 0}
              minutesValue={minutes}
            />
          ))}
        </div>
      </div>
    )
  } else {
    const parts = formatTimeParts(days, minutes + hours * 60, seconds)
    let foundNonZero = false

    return (
      <div className="font-pixel font-[400] text-[12px] leading-[120%] mt-1">
        {parts.map((val, i) => {
          if (val !== 0) foundNonZero = true
          const color = foundNonZero ? 'text-[#B6FF00]' : 'text-[#FFFFFF99]'

          return (
            <span key={i} className={color}>
              {zeroPad(val)}
              {i < parts.length - 1 && ':'}
            </span>
          )
        })}
      </div>
    )
  }
}
