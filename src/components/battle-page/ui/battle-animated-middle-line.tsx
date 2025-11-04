import { cn } from '@/utils'
import { BattleRainSplitLine } from './battle-rain-split-line'

export const BattleAnimatedMiddleLine = ({
  onAnimationEnd,
  className,
  classNameForLine,
}: {
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
  className?: string
  classNameForLine?: string
}) => {
  return (
    <div className={cn('w-full', className)}>
      <p className="font-pixel text-xl text-center">VS</p>
      <BattleRainSplitLine
        className={cn('absolute -z-1', classNameForLine)}
        onAnimationEnd={onAnimationEnd}
      />
    </div>
  )
}
