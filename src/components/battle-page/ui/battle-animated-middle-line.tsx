import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  return (
    <div className={cn('w-full', className)}>
      <p className="font-pixel text-xl text-center">{t('battle.vs')}</p>
      <BattleRainSplitLine
        className={cn('absolute -z-1', classNameForLine)}
        onAnimationEnd={onAnimationEnd}
      />
    </div>
  )
}
