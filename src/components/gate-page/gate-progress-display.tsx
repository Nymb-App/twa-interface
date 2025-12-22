import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { zeroPad } from 'react-countdown'

export const GateProgressDisplay = ({
  icon,
  current,
  max = 0,
  label,
  className,
  isLockedNewGate,
}: {
  icon: ReactNode
  current: number
  max?: number
  label: string
  className?: string
  isLockedNewGate?: boolean
}) => {
  return (
    <div
      className={cn(
        'font-pixel flex flex-col items-center justify-center gap-2 font-[400] uppercase',
        className,
      )}
    >
      <div>{icon}</div>
      <div className="text-[24px] leading-[32px] tracking-[0.3px] text-[#FFFFFF]">
        <span
          className={cn(
            max && current >= max && current !== 0 && 'text-[#B6FF00]',
            current < max && current !== 0 && 'text-[#FFFFFF]',
          )}
        >
          {label === 'years'
            ? zeroPad(current > 99 ? '99+' : current)
            : current > 99
              ? '99+'
              : current}
        </span>
        {!isLockedNewGate && (
          <>
            <span className="font-inter mx-1 text-[24px] leading-[32px] tracking-[0.3px] text-[#FFFFFF]/40">
              /
            </span>
            <span className={cn(label === 'ticket' && max === 1 && '-ml-2')}>
              {label === 'years' ? zeroPad(max > 99 ? '99+' : max) : max}
            </span>
          </>
        )}
      </div>
      <span
        className={cn(
          'text-[16px] leading-[20px] text-[#FFFFFF]/40',
          isLockedNewGate && 'text-[#FFFFFF]',
        )}
      >
        {label}
      </span>
    </div>
  )
}
