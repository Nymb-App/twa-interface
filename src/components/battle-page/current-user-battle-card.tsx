import { ElectricLines } from '../ui/electric-lines'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { cn } from '@/utils'
import { AvatarCard } from '@/routes/send-gift'

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
      {/* <AvatarCard
                className={cn(
                  'w-full h-auto object-cover rounded-[34px]',
                  isTranslateCardsAnimationStart &&
                    '!animate-battle-final-animation-fade-out !transition-all !duration-1300 !linear',
                )}
                classNameForSpan={cn(
                  'text-3xl text-white font-bold pr-1',
                  isTranslateCardsAnimationStart &&
                    '!animate-battle-final-animation-fade-out translate-y-[175px] -translate-x-[67px] text-[14px] !transition-all !duration-1300 !linear',
                )}
                classNameForImg={cn(
                  'rounded-[34px] w-full h-full object-cover shadow-[0px_0px_59.8px_#8C35FB]',
                  isTranslateCardsAnimationStart &&
                    'shadow-none -translate-x-[22px] translate-y-[185px] size-[32px] !transition-all !duration-1300 !linear',
                )}
                src="/roulette-icons/default.webp"
                label="IM"
              />
            </div>
            <p
              className={cn(
                isTranslateCardsAnimationStart &&
                  'translate-x-[20px] translate-y-[63px] ml-0 text-[14px] !animate-battle-final-animation-fade-out !transition-all !duration-1300 !linear',
                // 'translate-x-[20px] translate-y-[63px] ml-0 text-[14px]',
              )}
            >
              igorivanov
            </p> */}
      <p
        className={cn(
          'opacity-0 animate-battle-preview-username-fade',
          isTranslateCardsAnimationStart &&
            'translate-x-[25px] -translate-y-[55px] text-[14px] opacity-100 !animate-battle-final-animation-fade-out !transition-all !duration-1300 !linear',
          // !animate-battle-final-animation-fade-out !transition-all !duration-1300 !linear'
        )}
      >
        teviall
      </p>
      <div
        className={cn(
          'relative z-1 size-[104px] rounded-[34px] opacity-0 animate-battle-preview-avatar-fade',
          isTranslateCardsAnimationStart && '',
        )}
      >
        <AvatarCard
          className={cn(
            'text-3xl text-white font-bold w-full h-auto object-cover shadow-[0_0px_50px_rgba(182,_255,_0,_0.3)] rounded-[34px] transition-all duration-1300 linear',
            isTranslateCardsAnimationStart &&
              'shadow-none !animate-battle-final-animation-fade-out size-[32px] translate-x-[5px] translate-y-[-105px]',
          )}
          classNameForSpan={cn(
            'text-3xl text-white font-bold transition-all duration-1300 linear',
            isTranslateCardsAnimationStart && 'text-[14px]',
          )}
          // classNameForImg={
          // cn()
          // 'w-full h-full object-cover shadow-[0_0px_50px_rgba(182,_255,_0,_0.3)]',
          // isTranslateCardsAnimationStart &&
          //   'shadow-none !transition-all !duration-1300 !linear',
          // }
          src="/roulette-icons/default.webp"
          label="NA"
        />
      </div>
      <FlickeringGrid
        className={cn(
          'absolute top-[10px] left-[60%] -translate-x-1/2 w-[450px] mask-[linear-gradient(to_right,transparent_0%,black_20%,black_70%,transparent_80%)]',
          isWasFoundOpponent && 'transition-all duration-1300 linear',
          isTranslateCardsAnimationStart &&
            '!animate-battle-final-animation-bg-fade-out',
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
