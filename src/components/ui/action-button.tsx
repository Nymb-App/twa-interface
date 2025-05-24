import type { ReactNode } from 'react'
import { cn } from '@/utils'

export const ActionButton = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full h-[56px] p-2 inline-flex justify-center items-center gap-1 font-pixel text-lg text-[#B6FF00] rounded-xl bg-gradient-to-b cursor-pointer from-[#ADFA4B] to-[#B6FF00]',
        className,
      )}
    >
      {children}
    </button>
  )
}
