import { NeonRain } from '../ui/neon-rain'
import { BattleRainSplitLine } from './battle-rain-split-line'

export const BattleScene = ({
  areaClaimedUnits = 0,
}: {
  areaClaimedUnits?: number
}) => {
  const claimedUnits = areaClaimedUnits / 2

  return (
    <div className="absolute inset-0">
      <div
        className={`absolute top-0 w-full transition-all duration-50`}
        style={{ height: `${50 - claimedUnits}%` }}
      >
        <NeonRain />
      </div>

      <BattleRainSplitLine
        position={50 + claimedUnits}
        className="duration-50"
      />

      <div
        className={`absolute bottom-0 w-full transition-all duration-50`}
        style={{ height: `${50 + claimedUnits}%` }}
      >
        <NeonRain
          className="rotate-180"
          gradColorGradient0="rgba(156,215,73, 1)"
          gradColorGradient1="rgba(156,215,73, 1)"
          gradColorGradient2="rgba(156,215,73, 1)"
          gradColorGradient3="rgba(156,215,73, 1)"
        />
      </div>
    </div>
  )
}
