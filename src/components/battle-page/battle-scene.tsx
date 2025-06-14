import { NeonRain } from '../ui/neon-rain'
import { BattleRainSplitLine } from './battle-rain-split-line'

export const BattleScene = ({ isBoostActive }: { isBoostActive?: boolean }) => {
  return (
    <div className="absolute inset-0">
      <div
        className={`absolute top-0 w-full transition-all duration-${isBoostActive ? 250 : 500} ease-linear`}
        style={{ height: `${100 - 50}%` }}
      >
        <NeonRain />
      </div>

      <BattleRainSplitLine position={50} isBoostActive={isBoostActive} />

      <div
        className={`absolute bottom-0 w-full transition-all duration-${isBoostActive ? 250 : 500} ease-linear`}
        style={{ height: `${50}%` }}
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
