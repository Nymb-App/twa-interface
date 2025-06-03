import type { ReactNode } from 'react'
import { ActionButton } from '@/components/ui/action-button'
import { cn } from '@/utils'

export const TaskDailyBlock = ({
  title,
  reward,
  buttonActionLabel,
  children,
  isTaskCompleted,
  setIsTaskCompleted,
}: {
  title: string
  reward: string
  buttonActionLabel: string
  isTaskCompleted: boolean
  setIsTaskCompleted: (value: boolean) => void
  children: ReactNode
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 items-center justify-center text-center basis-1/3',
        isTaskCompleted && 'opacity-10',
      )}
    >
      {children}
      <p className="font-inter text-[16px] leading-[20px] font-[600] text-[#FFFFFF]">
        {title}
      </p>
      <span className="font-pixel uppercase leading-[120%] text-[14px] font-[400] text-[#FFFFFF]/40">
        <span>+</span>
        <span
        // className={cn(
        //   Number(reward.split(' ')[0]) > 0 &&
        //     Number(reward.split(' ')[0]) < 20 &&
        //     '-ml-1.5',
        // )}
        >
          {reward.split(' ')[0]}
        </span>
        <span className="ml-1.5">{reward.split(' ')[1]}</span>
      </span>
      {!isTaskCompleted ? (
        <ActionButton
          onClick={() => setIsTaskCompleted(true)}
          className="rounded-[8px] font-[400] w-auto h-[24px] text-[#121312] uppercase leading-[16%] text-[12px]"
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
    <div className="h-[32px] w-[32px] flex justify-center items-center bg-[#B6FF00]/8 rounded-[12px]">
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
