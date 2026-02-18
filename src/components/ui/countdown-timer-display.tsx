import { cn } from '@/lib/utils'
import { zeroPad } from 'react-countdown'
import { useTranslation } from 'react-i18next';

interface CountdownTimerProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  completed?: boolean
  isCountdownHeaderView?: boolean
}

export const CountdownTimerDisplay = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
  isCountdownHeaderView,
}: CountdownTimerProps) => {
  if (!isCountdownHeaderView) {
    return null
  }

  const { t } = useTranslation();

  const getTimeParts = () => {
    if (completed) {
      return [
        { value: 0, label: t('timer-parts.weeks') },
        { value: 0, label: t('timer-parts.days') },
        { value: 0, label: t('timer-parts.hours') },
        { value: 0, label: t('timer-parts.minutes') },
        { value: 0, label: t('timer-parts.seconds') },
      ]
    }

    const calculatedYears = Math.floor(days / 365)

    if (calculatedYears > 0) {
      const years = Math.min(99, calculatedYears)
      const remainingDaysAfterYears = days % 365
      const weeks = Math.floor(remainingDaysAfterYears / 7)
      const finalRemainingDays = remainingDaysAfterYears % 7

      return [
        { value: years, label: t('timer-parts.years') },
        { value: weeks, label: t('timer-parts.weeks') },
        { value: finalRemainingDays, label: t('timer-parts.days') },
        { value: hours, label: t('timer-parts.hours') },
        { value: minutes, label: t('timer-parts.minutes') },
      ]
    }

    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7

    return [
      { value: weeks, label: t('timer-parts.weeks') },
      { value: remainingDays, label: t('timer-parts.days') },
      { value: hours, label: t('timer-parts.hours') },
      { value: minutes, label: t('timer-parts.minutes') },
      { value: seconds, label: t('timer-parts.seconds') },
    ]
  }

  const timeParts = getTimeParts()
  let hasFoundNonZero = false

  return (
    <div className="text-center">
      <div className="flex justify-center gap-6">
        {timeParts.map((item, index) => {
          const isHighlighted =
            !completed && (item.value !== 0 || hasFoundNonZero)
          if (isHighlighted) {
            hasFoundNonZero = true
          }

          const colorClass = isHighlighted
            ? 'font-[400] text-[30px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]'
            : 'text-[#FFFFFF]/40 font-[400] text-[30px]'

          return (
            <div
              key={item.label}
              className={cn(
                'w-[50px] relative',
                index !== 0 &&
                  'before:content-[":"] before:text-[30px] before:absolute before:-left-[25px] before:top-[22px] before:-translate-y-1/2 before:text-gray-500',
              )}
            >
              <p
                className={cn(
                  'leading-[120%] mb-2',
                  colorClass,
                  String(item.value).startsWith('1') &&
                    item.value > 9 &&
                    'mr-2.5',
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
