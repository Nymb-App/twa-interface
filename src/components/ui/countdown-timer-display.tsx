import { zeroPad } from 'react-countdown'
import { cn } from '@/utils'

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
  completed?: boolean
}) => {
  if (!isCountdownHeaderView) {
    return null
  }

  const computedWeeks = completed ? 0 : Math.floor(days / 7)
  const remainingDays = completed ? 0 : days % 7
  const blocks = [
    { label: 'Weeks', value: computedWeeks },
    { label: 'Days', value: remainingDays },
    { label: 'Hours', value: completed ? 0 : hours },
    { label: 'Minutes', value: completed ? 0 : minutes },
    { label: 'Seconds', value: completed ? 0 : seconds },
  ]

  let hasFoundNonZero = false

  return (
    <div className="text-center">
      <div className="flex justify-center gap-6">
        {blocks.map((item, index) => {
          const isHighlighted = item.value !== 0 || hasFoundNonZero

          if (isHighlighted) {
            hasFoundNonZero = true
          }

          const colorClass = isHighlighted
            ? 'font-[400] text-[30px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]'
            : 'text-[#FFFFFF]/40 font-[400] text-[30px]'

          return (
            <div
              key={item.label}
              className={`w-[50px] relative ${
                index !== 0 &&
                'before:content-[":"] before:text-[30px] before:absolute before:-left-[25px] before:top-[22px] before:-translate-y-1/2 before:text-gray-500'
              }`}
            >
              <p
                className={cn(
                  'leading-[120%] mb-2',
                  colorClass,
                  item.value > 9 && item.value <= 19 && 'pr-3',
                )}
              >
                {zeroPad(item.value)}
              </p>
              <p className="text-[10px] font-[400] uppercase text-[#FFFFFF]/40">
                {item.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
