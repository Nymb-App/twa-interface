import { cn } from '@/utils'
import type { ReactNode } from 'react'
import useSound from 'use-sound'

export const ActionButton = ({
  children,
  className,
  disabled,
  onClick,
  onAnimationEnd,
}: {
  children: ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  onAnimationEnd?: React.AnimationEventHandler<HTMLButtonElement>
}) => {
  const [play] = useSound('sounds/Button.aac')

  return (
    <button
      disabled={disabled}
      onAnimationEnd={onAnimationEnd}
      onClick={() => {
        play()
        onClick?.()
      }}
      className={cn(
        'w-full h-[56px] p-2 inline-flex justify-center items-center gap-1 font-pixel text-lg text-[#B6FF00] rounded-[16px] cursor-pointer bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00]',
        className,
      )}
    >
      {children}
    </button>
  )
}
