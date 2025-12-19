import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { ActionButton } from '@/components/ui/action-button'
import { cn, formatDurationFromSeconds } from '@/utils'
import { useAccountMe } from '@/hooks/api/use-account'

export const TaskDailyBlock = ({
  title,
  reward,
  buttonActionLabel,
  children,
  isTaskCompleted,
  onComplete,
}: {
  title: string
  reward: {
    type: 'time' | 'energy'
    value: number
  }
  buttonActionLabel: string
  isTaskCompleted: boolean
  onComplete: () => void
  children: ReactNode
}) => {
  const formattedReward =
    reward.type === 'time'
      ? formatDurationFromSeconds(reward.value).split(' ')
      : [String(reward.value), 'e']

      console.log(reward, 'reward')
  const [value, unit] = formattedReward
  const { accountQuery } = useAccountMe()

  const isDisabledActionButton = useMemo(() => {
    if (!accountQuery.data) return true
    return accountQuery.data.time * 1000 < Date.now()
  }, [accountQuery.data])

  return (
    <div
      className={cn(
        'flex flex-col gap-2 items-center justify-center text-center basis-1/3 pt-3',
        isTaskCompleted && 'opacity-10',
      )}
    >
      {children}
      <p className="flex items-center font-inter min-h-10 text-[16px] leading-[20px] font-[600] text-[#FFFFFF]">
        {title}
      </p>
      <span className={cn("relative font-pixel uppercase leading-[120%] text-[14px] font-[400] text-[#FFFFFF]/40 flex items-center gap-1", value === '0' && 'hidden')}>
        <span className="absolute -left-1">+</span>
        <span>{value}</span>
        <span>{unit}</span>
      </span>
      {!isTaskCompleted ? (
        <ActionButton
          disabled={isDisabledActionButton}
          onClick={onComplete}
          className="disabled:opacity-50 disabled:cursor-not-allowed rounded-[8px] font-[400] w-auto h-[24px] text-[#121312] uppercase leading-[16%] text-[12px]"
        >
          <span>{buttonActionLabel}</span>
        </ActionButton>
      ) : (
        <TaskCompletedSvgIcon />
      )}
    </div>
  )
}

export const TaskCompletedSvgIcon = () => {
  return (
    <div className="size-8 flex justify-center items-center bg-[#B6FF00]/8 rounded-[12px]">
      <svg
        width="12"
        height="9"
        viewBox="0 0 12 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.42859 3.99995L4.85716 7.42852L10.5714 1.71423"
          stroke="#B6FF00"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
