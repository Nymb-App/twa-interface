import { zeroPad } from 'react-countdown'
import { FlickeringGrid } from '../magicui/flickering-grid'
import type { ReactNode } from 'react'
import { WatchesIcon } from '@/assets/icons/watches'
import { TicketIcon } from '@/assets/icons/ticket'
import { cn } from '@/utils'
import { LockIcon } from '@/assets/icons/lock'

export function GateHeader() {
  return (
    <header className="relative text-center font-[400]">
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
          current={0}
          max={1}
          label="years"
        />
        <GateNextDisplayBlock className="z-1 border-2 backdrop-blur-[8px] mr-4" />
        <GateProgressDisplay
          icon={<TicketIcon />}
          current={0}
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
}: {
  icon: ReactNode
  current: number
  max: number
  label: string
  className?: string
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
        <span className={cn(current > 0 && ' text-[#B6FF00]')}>
          {label === 'years' ? zeroPad(current) : current}
        </span>
        <span className="font-inter text-[#FFFFFF]/40 text-[24px] leading-[32px] tracking-[0.3px] mx-1">
          /
        </span>
        <span className={cn(label === 'ticket' && max === 1 && '-ml-2')}>
          {label === 'years' ? zeroPad(max) : max}
        </span>
      </div>
      <span className="text-[#FFFFFF]/40 text-[16px] leading-[20px]">
        {label}
      </span>
    </div>
  )
}

const GateNextDisplayBlock = ({
  isLocked = true,
  className,
}: {
  isLocked?: boolean
  className?: string
}) => {
  return (
    <GateContentBlock
      className={cn(
        'flex justify-center items-center w-[88px] h-[88px]',
        className,
      )}
    >
      <LockIcon className="w-[26px] h-[32px]" />
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
