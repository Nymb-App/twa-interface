import { zeroPad } from 'react-countdown'
// import { useContext } from 'react'
// import { FlickeringGrid } from '../magicui/flickering-grid'
import { useMemo } from 'react'
import type { ReactNode } from 'react'
// import { WatchesIcon } from '@/assets/icons/watches'
// import { TicketIcon } from '@/assets/icons/ticket'
import { cn } from '@/utils'
import { LockIcon } from '@/assets/icons/lock'
// import { GateContext } from '@/context/gate-context'

// export function GateHeader() {
//   const { year, ticket, currentLevel, isLockedNewGate } =
//     useContext(GateContext)
//   return (
//     <header className="relative text-center font-[400]">
//       <h1 className="font-pixel mb-2 text-[24px] leading-[32px] text-[#FFFFFF] uppercase">
//         gates
//       </h1>
//       <p className="font-inter mb-4 text-[14px] leading-[140%] text-[#FFFFFF]/60">
//         Upgrade gat levels to get more rewards. <br /> Lower the level, the
//         closer you are to the main <br /> reward - airdrop
//       </p>
//       <div className="flex items-center justify-between px-6.5 pb-[56px]">
//         <GateProgressDisplay
//           icon={<WatchesIcon />}
//           current={year}
//           max={1}
//           label="years"
//         />
//         <GateNextDisplayBlock
//           className="z-1 mr-4 border-2 backdrop-blur-[8px]"
//           isLockedNewGate={isLockedNewGate}
//           currentLevel={currentLevel}
//         />
//         <GateProgressDisplay
//           icon={<TicketIcon className="h-[45px] w-[45px]" />}
//           current={ticket}
//           max={1}
//           label="ticket"
//         />
//       </div>
//       <FlickeringGrid
//         className="absolute inset-0 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
//         squareSize={2}
//         gridGap={12}
//         color="#FFFFFF"
//         maxOpacity={0.5}
//         flickerChance={0.3}
//         autoResize={false}
//         width={450}
//         height={450}
//       />
//     </header>
//   )
// }

export const GateProgressDisplay = ({
  icon,
  current,
  max = 0,
  label,
  className,
  isLockedNewGate,
}: {
  icon: ReactNode
  current: number
  max?: number
  label: string
  className?: string
  isLockedNewGate?: boolean
}) => {
  return (
    <div
      className={cn(
        'font-pixel flex flex-col items-center justify-center gap-2 font-[400] uppercase',
        className,
      )}
    >
      <div>{icon}</div>
      <div className="text-[24px] leading-[32px] tracking-[0.3px] text-[#FFFFFF]">
        <span
          className={cn(
            max && current >= max && current !== 0 && 'text-[#B6FF00]',
            current < max && current !== 0 && 'text-[#FFFFFF]',
          )}
        >
          {label === 'years'
            ? zeroPad(current > 99 ? '+99' : current)
            : current > 99
              ? '+99'
              : current}
        </span>
        {!isLockedNewGate && (
          <>
            <span className="font-inter mx-1 text-[24px] leading-[32px] tracking-[0.3px] text-[#FFFFFF]/40">
              /
            </span>
            <span className={cn(label === 'ticket' && max === 1 && '-ml-2')}>
              {label === 'years'
                ? zeroPad(max > 99 ? '+99' : max)
                : max > 99
                  ? '+99'
                  : max}
            </span>
          </>
        )}
      </div>
      <span
        className={cn(
          'text-[16px] leading-[20px] text-[#FFFFFF]/40',
          isLockedNewGate && 'text-[#FFFFFF]',
        )}
      >
        {label}
      </span>
    </div>
  )
}

interface IGateNextDisplayBlock {
  className?: string
  isLockedNewGate?: boolean
  currentLevel: number
  animationSpanClass?: string
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
}

export const GateNextDisplayBlock = ({
  isLockedNewGate = true,
  className,
  currentLevel,
  animationSpanClass,
  onAnimationEnd,
}: IGateNextDisplayBlock) => {
  const nextLvl = useMemo(() => currentLevel - 1, [currentLevel])

  return (
    <div
      className={cn(
        'flex h-[88px] w-[88px] items-center justify-center rounded-[32px] border-2 backdrop-blur-[16px]',
        isLockedNewGate
          ? 'border-[#FFFFFF]/12'
          : 'border-[#B6FF00] shadow-[0_0_32px_rgba(182,255,0,0.4)]',
        className,
      )}
    >
      {isLockedNewGate ? (
        <LockIcon className="h-[32px] w-[26px]" />
      ) : (
        <span
          onAnimationEnd={onAnimationEnd}
          className={cn(
            'font-pixel text-[30px] leading-[120%] font-[400] text-[#B6FF00]',
            String(nextLvl).startsWith('1') ? 'mr-2.5' : 'ml-0',
            animationSpanClass,
          )}
        >
          {nextLvl}
        </span>
      )}
    </div>
  )
}

// export const GateContentBlock = ({
//   children,
//   className,
// }: {
//   children: ReactNode
//   className?: string
// }) => {
//   return (
//     <div
//       className={cn(
//         'rounded-[32px] border-1 border-[#FFFFFF]/12 bg-[#161816]/80 backdrop-blur-[16px]',
//         className,
//       )}
//     >
//       <div>{children}</div>
//     </div>
//   )
// }
