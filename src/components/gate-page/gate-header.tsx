import { zeroPad } from 'react-countdown'
import { useContext } from 'react'
import { FlickeringGrid } from '../magicui/flickering-grid'
import type { ReactNode } from 'react'
import { WatchesIcon } from '@/assets/icons/watches'
import { TicketIcon } from '@/assets/icons/ticket'
import { cn } from '@/utils'
import { LockIcon } from '@/assets/icons/lock'
import { ArrowIcon } from '@/assets/icons/arrow'
import { GateContext } from '@/context/gate-context'

export function GateHeader() {
  const { year, ticket, currentLevel, isLockedNewGate } =
    useContext(GateContext)
  return (
    <header className="relative text-center font-[400]">
      <MarqueeVertical />
      <h1 className="font-pixel text-[24px] leading-[32px] text-[#FFFFFF] uppercase mb-2">
        gates
      </h1>
      <p className="font-inter text-[#FFFFFF]/60 text-[14px] leading-[140%] mb-4">
        Upgrade gat levels to get more rewards. <br /> Lower the level, the
        closer you are to the main <br /> reward - airdrop
      </p>
      <div className="flex justify-between items-center px-6.5 pb-[56px]">
        <GateProgressDisplay
          icon={<WatchesIcon />}
          current={year}
          max={1}
          label="years"
        />
        <GateNextDisplayBlock
          className="z-1 border-2 backdrop-blur-[8px] mr-4"
          isLockedNewGate={isLockedNewGate}
          currentLevel={currentLevel}
        />
        <GateProgressDisplay
          icon={<TicketIcon className="h-[45px] w-[45px]" />}
          current={ticket}
          max={1}
          label="ticket"
        />
      </div>
      <FlickeringGrid
        className="absolute inset-0 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="#FFFFFF"
        maxOpacity={0.5}
        flickerChance={0.3}
        autoResize={false}
        width={450}
        height={450}
      />
    </header>
  )
}

export const GateProgressDisplay = ({
  icon,
  current,
  max,
  label,
  className,
  isLockedNewGate,
}: {
  icon: ReactNode
  current: number
  max: number
  label: string
  className?: string
  isLockedNewGate?: boolean
}) => {
  return (
    <div
      className={cn(
        'font-pixel font-[400] flex flex-col justify-center items-center gap-2 uppercase',
        className,
      )}
    >
      <div>{icon}</div>
      <div className="text-[24px] text-[#FFFFFF] leading-[32px] tracking-[0.3px]">
        <span
          className={cn(
            current > 0 && ' text-[#B6FF00]',
            isLockedNewGate && 'text-[#FFFFFF]',
          )}
        >
          {label === 'years' ? zeroPad(current) : current}
        </span>
        {!isLockedNewGate && (
          <>
            <span className="font-inter text-[#FFFFFF]/40 text-[24px] leading-[32px] tracking-[0.3px] mx-1">
              /
            </span>
            <span className={cn(label === 'ticket' && max === 1 && '-ml-2')}>
              {label === 'years' ? zeroPad(max) : max}
            </span>
          </>
        )}
      </div>
      <span
        className={cn(
          'text-[#FFFFFF]/40 text-[16px] leading-[20px]',
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
  isLockedNewGate = false,
  className,
  currentLevel,
  animationSpanClass,
  onAnimationEnd,
}: IGateNextDisplayBlock) => {
  return (
    <GateContentBlock
      className={cn(
        'flex justify-center items-center w-[88px] h-[88px]',
        isLockedNewGate &&
          'border-[#B6FF00] shadow-[0_0_32px_rgba(182,255,0,0.24),_inset_0_0_16px_rgba(182,255,0,0.24)]',
        className,
      )}
    >
      {!isLockedNewGate ? (
        <LockIcon className="w-[26px] h-[32px]" />
      ) : (
        <span
          onAnimationEnd={onAnimationEnd}
          className={cn(
            String(currentLevel).startsWith('1') ? 'mr-3' : 'mr-0',
            // currentLevel > 20 && 'mr-0',
            // currentLevel >= 1 && currentLevel <= 19 && 'mr-3',
            `text-[#B6FF00] font-pixel text-[30px] font-[400] leading-[120%] ${animationSpanClass}`,
          )}
        >
          {currentLevel - 1}
        </span>
      )}
    </GateContentBlock>
  )
}

export const GateContentBlock = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'bg-[#161816]/80 border-1 border-[#FFFFFF]/12 backdrop-blur-[16px] rounded-[32px]',
        className,
      )}
    >
      <div>{children}</div>
    </div>
  )
}

const MarqueeVertical = () => {
  return (
    <>
      {/* Контейнер линии с движущейся стрелкой */}
      <div className="absolute top-1/2 z-0 left-[49.5%] -translate-x-1/2 -translate-y-1/2 top-0 right-0 w-[250px] h-[4px] -rotate-90 overflow-visible">
        <div className="relative w-full h-full">
          <ArrowIcon className="arrow-move absolute -top-[3px] left-0 text-[#B6FF00] w-[15px] h-[15px]" />
        </div>
      </div>

      {/* Визуальная линия */}
      <div
        className="top-[260px] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none absolute
        w-[250px] h-[4px] z-0 bg-line-gradient rotate-90 blur-[3px]"
      />

      {/* Световой градиент */}
      <div
        className="left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none absolute inset-0 top-[375px]
        w-[14px] h-[350px] z-0 bg-gradient-to-b from-[#B6FF00]/25 to-[#B6FF00]/75 blur-[12px]"
      />

      <style>{`
        @keyframes arrow-line {
          0% { left: -50px; }
          100% { left: 90px; }
        }

        .arrow-move {
          animation: arrow-line 4s linear infinite;
        }
      `}</style>
    </>
  )
}
