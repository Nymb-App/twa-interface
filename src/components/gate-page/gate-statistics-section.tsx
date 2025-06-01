import { zeroPad } from 'react-countdown'
import { useContext } from 'react'
import { GateContentBlock } from './gate-header'
import type { ReactNode } from 'react'
import { cn } from '@/utils'
import { GateContext } from '@/context/gate-context'

export function GateStatisticsSection() {
  const { currentLevel } = useContext(GateContext)
  return (
    <section className="relative">
      <GateContentBlock className="font-pixel font-[400] text-center p-4 pt-3">
        <h2 className="flex justify-center items-center mb-2 text-[14px] leading-[120%] text-[#FFFFFF]/40 uppercase">
          you on the
          <span
            className={cn(
              'text-[#FFFFFF] text-[48px] leading-[120%] px-4',
              currentLevel > 9 && '-ml-5.5',
              currentLevel === 1 && '-ml-5.5',
            )}
          >
            {currentLevel}
          </span>
          gate level
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <GateStatisticsInfoBlock value={1} description="Daily reward">
            <span className="ml-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
              d
            </span>
          </GateStatisticsInfoBlock>
          <GateStatisticsInfoBlock value={6} description="Mining">
            <span className="ml-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
              h
            </span>
          </GateStatisticsInfoBlock>
          <GateStatisticsInfoBlock value={5} description="in Battle">
            <span className="ml-1.5 mr-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
              /
            </span>
            <span className="ml-2 text-[14px] leading-[120%] text-[#FFFFFF]/40">
              day
            </span>
          </GateStatisticsInfoBlock>
          <GateStatisticsInfoBlock value={2} description="In Swipe">
            <span className="ml-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
              point
            </span>
          </GateStatisticsInfoBlock>
        </div>
      </GateContentBlock>
    </section>
  )
}

const GateStatisticsInfoBlock = ({
  value,
  description,
  children,
}: {
  value: number
  description: string
  children: ReactNode
}) => {
  const shouldZeroPad = ['mining', 'daily reward'].includes(
    description.toLowerCase(),
  )
  return (
    <div className="rounded-[16px] uppercase starboard-result-block-bg backdrop-blur-[16px] px-2 py-3.5">
      <span className="text-[#FFFFFF] text-[24px] leading-[32px] tracking-[0.3px]">
        <span>{shouldZeroPad ? zeroPad(value) : value}</span>
      </span>
      {children}
      <p className="font-inter text-[#FFFFFF] text-[14px] leading-[140%] mt-2 normal-case">
        {description}
      </p>
    </div>
  )
}
