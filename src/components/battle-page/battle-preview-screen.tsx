import { useContext, useEffect, useState } from 'react'
import { ActionButton } from '../ui/action-button'
import { PageLayout } from '../ui/page-layout'
import { Container } from '../ui/container'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { ElectricLines } from '../ui/electric-lines'
import { BattleCard } from './opponent-battle-card'
import type { ReactNode } from 'react'
import { cn } from '@/utils'
import { AppContext } from '@/context/app-context'

export function BattlePreviewScreen({ onClick }: { onClick?: () => void }) {
  const [isAnimationsEnd, setIsAnimationsEnd] = useState(false)

  useEffect(() => {
    if (!isAnimationsEnd) {
      document.body.style.overflowY = 'hidden'
    }
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isAnimationsEnd])

  return (
    <PageLayout
      useFooter={false}
      className={cn(
        'bg-[#03061a] pb-50 animate-battle-preview-slide overflow-hidden',
        isAnimationsEnd && 'overflow-y-auto',
      )}
    >
      <header className="font-pixel font-[400] text-center">
        <BattleTitle
          className="opacity-0 animate-battle-preview-title-fade"
          text={
            <>
              Enter the
              <br />
              bet amount
            </>
          }
        />
        {/* <CurrentUserBattleCard /> */}
        <BattleCard showElectricsLines={false} nickname="tevial" />
      </header>
      <BattleGameRewardSection isAnimationsEnd={isAnimationsEnd} />
      <div
        className="fixed bottom-0 pb-12 px-4 w-full max-w-[450px] z-50 bg-[#03061a] opacity-0 animate-battle-preview-find-fade"
        onAnimationEnd={() => setIsAnimationsEnd(true)}
      >
        <p className="font-inter text-[#FFFFFF]/40 text-[14px] font-[400] leading-[140%] text-center mb-4">
          The opponent will be <br /> randomly selected. Commission 1%
        </p>
        <ActionButton
          onClick={onClick}
          className={cn(
            'font-pixel text-[#121312] rounded-[16px] uppercase',
            !isAnimationsEnd && 'pointer-events-none',
          )}
        >
          <span>finding the opponent</span>
        </ActionButton>
      </div>
    </PageLayout>
  )
}

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
        'text-[24px] leading-[32px] text-[#FFFFFF] uppercase mb-4',
        className,
      )}
    >
      {text}
    </h1>
  )
}

export function BattleGameRewardSection({
  className,
  isAnimationsEnd,
}: {
  className?: string
  isAnimationsEnd?: boolean
}) {
  const { battleGameRewardRadioValue, setBattleGameRewardRadioValue } =
    useContext(AppContext)

  return (
    <section className={cn('relative', className)}>
      <Container>
        <div className="font-pixel rounded-[24px] border border-[#2B311C] backdrop-blur-[16px] bg-[rgba(255, 255, 255, 0.01)] p-4 uppercase mb-[21px] opacity-0 animate-battle-preview-reward-fade">
          <div className="text-center">
            <span className="text-[white] tracking-[5px] font-[400] text-[48px] leading-[120%] [-webkit-text-stroke:3px_rgba(182,255,0,1)] [text-shadow:0px_0px_15px_rgba(182,255,0,0.2)]">
              {battleGameRewardRadioValue}
            </span>
          </div>
          <div className="h-[1px] bg-[#FFFFFF1F] my-4" />
          <RadioGroup
            defaultValue="1 weeks"
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
        "relative font-pixel flex flex-col items-center gap-6 bg-[url('/minigames/battle-header-bg.png')] bg-no-repeat bg-bottom bg-[length:100%_100%] pt-[26px] h-[220px] uppercase overflow-hidden",
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
          src={'/roulette-icons/default.png'}
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
