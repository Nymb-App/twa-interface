import { memo, useMemo } from 'react'
import { NeonRain } from '../ui/neon-rain'
import { BattleRainSplitLine } from './ui/battle-rain-split-line'

interface BattleSceneProps {
  areaClaimedUnits?: number
}

// Константы для цветов зеленого дождя
const GREEN_RAIN_COLORS = {
  gradient0: 'rgba(156,215,73, 1)',
  gradient1: 'rgba(156,215,73, 1)',
  gradient2: 'rgba(156,215,73, 1)',
  gradient3: 'rgba(156,215,73, 1)',
}

// Мемоизируем компонент для предотвращения ненужных ререндеров
export const BattleScene = memo(
  ({ areaClaimedUnits = 0 }: BattleSceneProps) => {
    // Вычисляем значения один раз при изменении areaClaimedUnits
    const { topHeight, bottomHeight, splitLinePosition } = useMemo(() => {
      const claimedUnits = areaClaimedUnits / 2
      return {
        topHeight: `${50 - claimedUnits}%`,
        bottomHeight: `${50 + claimedUnits}%`,
        splitLinePosition: 50 + claimedUnits,
      }
    }, [areaClaimedUnits])

    return (
      <div className="absolute inset-0">
        {/* Верхняя секция с неоновым дождем */}
        <div
          className="absolute top-0 w-full transition-all duration-50"
          style={{ height: topHeight }}
        >
          <NeonRain />
        </div>

        {/* Разделительная линия */}
        <BattleRainSplitLine
          position={splitLinePosition}
          className="duration-50"
        />

        {/* Нижняя секция с зеленым дождем */}
        <div
          className="absolute bottom-0 w-full transition-all duration-50"
          style={{ height: bottomHeight }}
        >
          <NeonRain
            className="rotate-180"
            gradColorGradient0={GREEN_RAIN_COLORS.gradient0}
            gradColorGradient1={GREEN_RAIN_COLORS.gradient1}
            gradColorGradient2={GREEN_RAIN_COLORS.gradient2}
            gradColorGradient3={GREEN_RAIN_COLORS.gradient3}
          />
        </div>
      </div>
    )
  },
)
