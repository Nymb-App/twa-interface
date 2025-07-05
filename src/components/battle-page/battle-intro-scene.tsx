import { useState } from 'react'
import { ActionButton } from '../ui/action-button'
import { BattleGameRewardSection, BattleTitle } from './battle-preview-screen'
import { BattleCard } from './opponent-battle-card'
import { BattleBustButtons } from './battle-bust-buttons'
import { cn } from '@/utils'

export const BattleIntroScene = ({
  onFindingOpponent,
  className,
  onAnimationEnd,
}: {
  onFindingOpponent?: () => void
  className?: string
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
}) => {
  const [isAnimationsBustButtonsEnd, setIsAnimationsBustButtonsEnd] =
    useState(false)

  const [isAnimationsFindButtonEnd, setIsAnimationsFindButtonEnd] =
    useState(false)

  const [isIntroSceneAnimationsStart, setIsIntroSceneAnimationsStart] =
    useState(false)

  return (
    <div
      className={cn(
        'flex flex-col justify-between',
        isIntroSceneAnimationsStart &&
          '!animate-battle-intro-section-slide-fade-out',
        className,
      )}
      onAnimationEnd={(e) => {
        onAnimationEnd?.(e)
        if (e.animationName === 'battle-intro-section-slide-fade-out') {
          onFindingOpponent?.()
        }
      }}
    >
      <header className="font-pixel font-[400] text-center">
        <BattleTitle
          className="opacity-0 animate-battle-preview-title-fade mb-4"
          text={
            <>
              Enter the
              <br />
              bet amount
            </>
          }
        />
        <BattleCard
          showElectricsLines={false}
          nickname="tevial"
          className="opacity-0 animate-battle-intro-slide-card-fade"
        />
      </header>
      <div className="flex-1">
        <BattleGameRewardSection />
        <BattleBustButtons
          className={cn(
            'opacity-0 animate-battle-preview-bust-fade',
            !isAnimationsBustButtonsEnd && 'pointer-events-none',
          )}
          onAnimationEnd={() => setIsAnimationsBustButtonsEnd(true)}
        />
      </div>
      <div className="px-4">
        <p className="font-inter text-[#FFFFFF]/40 text-[14px] font-[400] leading-[140%] text-center mb-4 opacity-0 animate-battle-preview-find-text-fade">
          The opponent will be <br /> randomly selected. Commission 1%
        </p>
        <ActionButton
          onClick={() => {
            setIsIntroSceneAnimationsStart(true)
          }}
          className={cn(
            'font-pixel text-[#121312] rounded-[16px] uppercase opacity-0 animate-battle-preview-find-button-fade',
            !isAnimationsFindButtonEnd && 'pointer-events-none',
          )}
          onAnimationEnd={() => setIsAnimationsFindButtonEnd(true)}
        >
          finding the opponent
        </ActionButton>
      </div>
    </div>
  )
}
