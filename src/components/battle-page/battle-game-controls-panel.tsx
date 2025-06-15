import { useState } from 'react'
import { BattleAnimatedBoostButton } from './battle-animated-boost-button'
import { BattleAnimatedPushButton } from './battle-animated-push-button'

export const BattleGameControlsPanel = ({
  onBoostActivate,
  onClick,
}: {
  onBoostActivate?: () => void
  onClick?: () => void
}) => {
  const [fillPercent0, setFillPercent0] = useState(0)
  const [fillPercent1, setFillPercent1] = useState(0)

  return (
    <div className="flex justify-evenly items-center h-full">
      <BattleAnimatedBoostButton
        fillPercentage={fillPercent0}
        onClick={() => {
          setFillPercent0(0)
          onBoostActivate?.()
        }}
      />
      <BattleAnimatedPushButton
        onClick={() => {
          onClick?.()
          setFillPercent0((prev: number) => prev + 1)
          setFillPercent1((prev: number) => prev + 1)
        }}
      />
      <BattleAnimatedBoostButton
        fillPercentage={fillPercent1}
        onClick={() => {
          setFillPercent1(0)
          onBoostActivate?.()
        }}
      />
    </div>
  )
}
