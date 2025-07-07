import { useEffect, useState } from 'react'
import { Container } from '../ui/container'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { ElectricLines } from '../ui/electric-lines'
import type { ReactNode } from 'react'
import { cn } from '@/utils'

export const BattleTitle = ({
  text,
  className,
}: {
  text: string | ReactNode
  className?: string
}) => {
  return (
    <h1
      className={cn(
        'text-[24px] leading-[32px] text-[#FFFFFF] uppercase',
        className,
      )}
    >
      {text}
    </h1>
  )
}

export function BattleGameRewardSection({
  onChange,
  className,
}: {
  onChange?: (value: number) => void
  className?: string
}) {
  const [battleGameRewardRadioValue, setBattleGameRewardRadioValue] =
    useState('1 weeks')

  useEffect(() => {
    switch (battleGameRewardRadioValue) {
      case '1 days':
        onChange?.(60 * 60 * 24)
        break
      case '1 weeks':
        onChange?.(60 * 60 * 24 * 7)
        break
      case '1 month':
        onChange?.(60 * 60 * 24 * 30)
        break
      case '1 years':
        onChange?.(60 * 60 * 24 * 365)
        break
      default:
        onChange?.(60 * 60 * 24 * 7)
    }
  }, [battleGameRewardRadioValue])

  return (
    <section className={cn('relative', className)}>
      <Container>
        <div className="font-pixel rounded-[24px] border border-[#2B311C] backdrop-blur-[16px] bg-[rgba(255, 255, 255, 0.01)] p-4 uppercase mb-[21px] opacity-0 animate-battle-preview-reward-fade">
          <div className="text-center relative h-[56px]">
            <span className="text-[#B6FF00] tracking-[5px] font-[400] text-[48px] leading-[120%] [text-shadow:0px_0px_15px_rgba(182,255,0,0.6)]">
              {battleGameRewardRadioValue}
            </span>
          </div>
          <div className="h-[1px] bg-[#FFFFFF1F] my-4" />
          <RadioGroup
            defaultValue="1"
            value={battleGameRewardRadioValue}
            onValueChange={(value) => {
              setBattleGameRewardRadioValue(value)
            }}
            className="flex gap-3 justify-center"
          >
            {['1 days', '1 weeks', '1 month', '1 years'].map((option) => (
              <div key={option} className="">
                <RadioGroupItem
                  value={option}
                  id={option}
                  className="hidden peer"
                />
                <label
                  htmlFor={option}
                  className={cn(
                    'backdrop-blur-[8px] py-1.5 pl-1 pr-1.5 rounded-[8px] cursor-pointer leading-[120%] text-[9.5px] font-[400] uppercase',
                    battleGameRewardRadioValue === option
                      ? 'border border-[#B6FF00] text-[#B6FF00] bg-[linear-gradient(360deg,_rgba(182,255,0,0.24)_0%,_rgba(182,255,0,0)_100%)] backdrop-blur-sm'
                      : 'border border-transparent starboard-result-block-bg text-[#FFFFFF66]',
                  )}
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Container>
    </section>
  )
}

export const CurrentUserBattleCard = ({
  isTranslateCardsAnimationStart,
  isWasFoundOpponent,
  cardHeight,
  style,
  className,
  isStartFindingOpponent,
  onAnimationEnd,
}: {
  isTranslateCardsAnimationStart?: boolean
  isWasFoundOpponent?: boolean
  cardHeight?: number
  style?: React.CSSProperties
  className?: string
  isStartFindingOpponent?: boolean
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
}) => {
  return (
    <div
      className={cn(
        "relative font-pixel flex flex-col items-center gap-6 bg-[url('/minigames/battle-header-bg.webp')] bg-no-repeat bg-bottom bg-[length:100%_100%] pt-[26px] h-[220px] uppercase overflow-hidden",
        className,
      )}
      onAnimationEnd={onAnimationEnd}
      style={style}
    >
      <p
        className={cn(
          'opacity-0 animate-battle-preview-username-fade',
          isTranslateCardsAnimationStart &&
            '!animate-battle-finding-button-fade-out',
        )}
      >
        teviall
      </p>
      <div
        className={cn(
          'relative z-1 size-[104px] rounded-[34px] opacity-0 animate-battle-preview-avatar-fade',
          isTranslateCardsAnimationStart &&
            '!animate-battle-finding-button-fade-out',
        )}
      >
        <img
          src={'/roulette-icons/default.webp'}
          className="w-full h-auto object-cover absolute z-1 rounded-[34px] shadow-[0_0px_50px_rgba(182,_255,_0,_0.3)]"
        />
        <p className="absolute z-1 left-1/2 top-1/2 -translate-1/2 text-3xl text-white font-bold">
          NA
        </p>
      </div>
      <FlickeringGrid
        className={cn(
          'absolute top-[120px] -translate-y-1/2 left-[60%] -translate-x-1/2 w-[450px] mask-[linear-gradient(to_right,transparent_0%,black_20%,black_70%,transparent_80%)]',
          isWasFoundOpponent &&
            'transition-[height] duration-1300 linear top-[56%]',
          isTranslateCardsAnimationStart &&
            'animate-battle-finding-button-fade-out',
        )}
        squareSize={2}
        gridGap={12}
        color="#b7ff01"
        maxOpacity={0.5}
        flickerChance={0.3}
        autoResize={false}
        width={450}
        height={cardHeight}
        style={{ height: `${cardHeight}px` }}
      />
      {isStartFindingOpponent && (
        <ElectricLines
          className={cn(
            'opacity-0 animate-battle-finding-lines-fade',
            isWasFoundOpponent &&
              'top-[90px] transition-all duration-1300 linear',
            isTranslateCardsAnimationStart &&
              '!animate-battle-finding-button-fade-out',
          )}
          accentColor="#B6FF00"
          svg1ClassName="top-[-15%] left-[72%]"
          svg2ClassName="top-[0%] left-[30%]"
          svg3ClassName="top-[80px] left-[130px]"
          svg4ClassName="top-[95px] left-[260px]"
        />
      )}
    </div>
  )
}
