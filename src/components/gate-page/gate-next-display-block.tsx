import { LockIcon } from '@/assets/icons/lock'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

interface IGateNextDisplayBlock {
  className?: string
  isLockedNewGate?: boolean
  currentLevel: number
  animationSpanClass?: string
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
}

export const GateNextDisplayBlock = ({
  isLockedNewGate = true,
  className,
  currentLevel,
  animationSpanClass,
  onAnimationEnd,
}: IGateNextDisplayBlock) => {
  const nextLvl = useMemo(
    () => (currentLevel - 1 > 0 ? currentLevel - 1 : 1),
    [currentLevel],
  )

  return (
    <div
      className={cn(
        'flex h-[88px] w-[88px] items-center justify-center rounded-[32px] border-2 backdrop-blur-[16px]',
        isLockedNewGate
          ? 'border-[#FFFFFF]/12'
          : 'border-[#B6FF00] shadow-[0_0_32px_rgba(182,255,0,0.4)]',
        className,
      )}
    >
      {isLockedNewGate ? (
        <LockIcon className="h-[32px] w-[26px]" />
      ) : (
        <span
          onAnimationEnd={onAnimationEnd}
          className={cn(
            'font-pixel text-[30px] leading-[120%] font-[400] text-[#B6FF00]',
            String(nextLvl).startsWith('1') ? 'mr-2.5' : 'ml-0',
            animationSpanClass,
          )}
        >
          {nextLvl}
          <LockIcon
            fillOpacity={1}
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 h-[26px] w-[20px]"
          />
        </span>
      )}
    </div>
  )
}
