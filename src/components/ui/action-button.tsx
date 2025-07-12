import type { ReactNode } from 'react'
import { cn } from '@/utils'

export const ActionButton = ({
  children,
  className,
  onClick,
  disabled,
  onAnimationEnd,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  onAnimationEnd?: React.AnimationEventHandler<HTMLButtonElement>
}) => {
  return (
    <button
      disabled={disabled}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}
      className={cn(
        'w-full h-[56px] p-2 inline-flex justify-center items-center gap-1 font-pixel text-lg text-[#B6FF00] rounded-[16px] cursor-pointer bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00]',
        className,
      )}
    >
      {children}
    </button>
  )
}
