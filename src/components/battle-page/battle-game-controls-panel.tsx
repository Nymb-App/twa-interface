import { useBuyExtraBoost } from '@/hooks/api/use-shop'
import { useEffect, useState } from 'react'
import useSound from 'use-sound'
import { BattleAnimatedBoostButton } from './ui/battle-animated-boost-button'
import { BattleAnimatedPushButton } from './ui/battle-animated-push-button'

export const BattleGameControlsPanel = ({
  disabled = true,
  boostDuration = 8000,
  onBoostActivate,
  onClick,
}: {
  disabled?: boolean
  boostDuration?: number
  onBoostActivate?: () => void
  onClick?: () => void
}) => {
  const BOOST_DURATION_PER_SECTION = boostDuration / 100

  const [fillPercent0, setFillPercent0] = useState(0)
  const [fillPercent1, setFillPercent1] = useState(0)

  const [isReversing0, setIsReversing0] = useState(false)
  const [isReversing1, setIsReversing1] = useState(false)

  const { extraBoostCount } = useBuyExtraBoost()
  console.log(extraBoostCount)

  const [playBoostGame, { stop: stopPlayBoostGame }] = useSound(
    '/sounds/Battle-Boost.aac',
  )

  const [playPushGame] = useSound('/sounds/Button.aac', { volume: 0.4 })

  // Обратный отсчёт
  useEffect(() => {
    if (isReversing0) {
      let reverseFillPercent0 = 100

      const interval = setInterval(() => {
        if (reverseFillPercent0 <= 0) {
          clearInterval(interval)
          setIsReversing0(false)
          return
        }
        reverseFillPercent0--
        setFillPercent0(reverseFillPercent0)
      }, BOOST_DURATION_PER_SECTION)
    }
    return () => {
      stopPlayBoostGame()
    }
  }, [isReversing0])

  useEffect(() => {
    if (isReversing1) {
      let reverseFillPercent1 = 100

      const interval = setInterval(() => {
        if (reverseFillPercent1 <= 0) {
          clearInterval(interval)
          setIsReversing1(false)
          return
        }
        reverseFillPercent1--
        setFillPercent1(reverseFillPercent1)
      }, BOOST_DURATION_PER_SECTION)
    }
    return () => {
      stopPlayBoostGame()
    }
  }, [isReversing1])

  return (
    <div className="flex justify-evenly items-center h-full">
      <BattleAnimatedBoostButton
        isDisabled={disabled}
        fillPercentage={fillPercent0}
        onClick={() => {
          playBoostGame()
          setIsReversing0(true)
          onBoostActivate?.()
        }}
      />
      <BattleAnimatedPushButton
        isDisabled={disabled}
        onClick={() => {
          playPushGame()
          onClick?.()
          if (fillPercent0 <= 100 && !isReversing0) {
            setFillPercent0((prev: number) => prev + 1)
          }
          if (fillPercent1 <= 100 && !isReversing1) {
            setFillPercent1((prev: number) => prev + 1)
          }
        }}
      />
      <BattleAnimatedBoostButton
        fillPercentage={fillPercent1}
        isDisabled={extraBoostCount <= 0 || disabled}
        onClick={() => {
          playBoostGame()
          setIsReversing1(true)
          onBoostActivate?.()
        }}
      />
    </div>
  )
}
