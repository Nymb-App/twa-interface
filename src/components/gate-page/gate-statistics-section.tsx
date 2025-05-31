import { zeroPad } from 'react-countdown'
import Marquee from 'react-fast-marquee'
import { GateContentBlock } from './gate-header'
import type { ReactNode } from 'react'
import { cn } from '@/utils'
import { ArrowIcon } from '@/assets/icons/arrow'

export function GateStatisticsSection({
  currentLevel,
}: {
  currentLevel: number
}) {
  return (
    <section className="relative">
      <MarqueeArrows />
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

const arrows = Array.from({ length: 20 })

const MarqueeArrows = () => {
  return (
    <div className="absolute -top-[6px] w-full z-0 -rotate-90">
      <div className="relative w-[280px]">
        <Marquee direction="right" speed={0}>
          {arrows.map((_, idx) => (
            <ArrowIcon key={idx} />
          ))}
        </Marquee>
        <div
          className="top-[0px]
pointer-events-none
absolute inset-y-0 -left-[85px]
w-[380px] h-full
z-[-1] bg-gradient-to-b from-[#B6FF00]/25 to-[#B6FF00]/75 blur-[12px]
"
        />
      </div>
    </div>
  )
}

// const MarqueeVertical = () => {
//   return (
//     <div className="absolute -top-[100px] left-1/2 z-0 overflow-hidden w-[48px] h-[350px]">
//       <div
//         className="flex flex-col items-center gap-5 relative"
//         style={{
//           animation: 'marquee-vertical 20s linear infinite',
//         }}
//       >
//         {arrows.map((_, idx) => (
//           <ArrowIcon key={`arrow-${idx}`} className="-rotate-90" />
//         ))}
//         {arrows.map((_, idx) => (
//           <ArrowIcon key={`arrow-clone-${idx}`} className="-rotate-90" />
//         ))}
//         <div
//           className="top-[0px]
// pointer-events-none
// absolute inset-y-0 -left-[85px]
// w-[90px] h-full
// z-[-1] bg-gradient-to-b from-[#B6FF00]/25 to-[#B6FF00]/75 blur-[12px]
// "
//         />
//       </div>

//       {/* Embedded styles */}
//       <style>{`
//         @keyframes marquee-vertical {
//           0% { transform: translateY(0); }
//           100% { transform: translateY(-50%); }
//         }
//       `}</style>
//     </div>
//   )
// }
