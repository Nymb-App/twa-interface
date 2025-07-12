import { cn } from '@/utils'

export const GateStatisticsInfoBlock = ({
  value,
  description,
  className,
  unit,
  isUnit = true,
}: {
  value: number
  description: string
  className?: string
  isZeroPad?: boolean
  unit?: string
  isUnit?: boolean
}) => {
  return (
    <div className="starboard-result-block-bg rounded-[16px] px-2 py-3.5 uppercase backdrop-blur-[16px]">
      <span className="text-[24px] leading-[32px] tracking-[0.3px] text-white">
        <span className={className}>{value}</span>
        {isUnit && (
          <span className="ml-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
            {unit}
          </span>
        )}
      </span>
      <p className="font-inter mt-2 text-[14px] leading-[140%] text-white normal-case">
        {description}
      </p>
    </div>
  )
}

export const GateInfoBlockNextLvl = ({
  dailyReward,
  mining,
  maxEnergy,
  swipePoints,
  className,
  className1,
  className2,
  className3,
  className4,
}: {
  dailyReward: number
  mining: number
  maxEnergy: number
  swipePoints: number
  className?: string
  className1?: string
  className2?: string
  className3?: string
  className4?: string
}) => {
  return (
    <div
      className={cn('font-pixel grid grid-cols-2 gap-3 text-center', className)}
    >
      <div className={className1}>
        <GateStatisticsInfoBlock
          value={dailyReward}
          description="Daily reward"
          className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]"
          unit="days"
        />
      </div>
      <div className={className2}>
        <GateStatisticsInfoBlock
          value={mining}
          description="Mining"
          unit="hours"
          className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]"
        />
      </div>
      <div className={className3}>
        <GateStatisticsInfoBlock
          value={maxEnergy}
          description="Max Energy"
          className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]"
        />
      </div>
      <div className={className4}>
        <GateStatisticsInfoBlock
          value={swipePoints}
          description="In Swipe"
          className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]"
          unit="point"
        />
      </div>
    </div>
  )
}
