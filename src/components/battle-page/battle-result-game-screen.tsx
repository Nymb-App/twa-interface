import { useRive } from '@rive-app/react-canvas'
import { ActionButton } from '../ui/action-button'
import { WatchesIcon } from '@/assets/icons/watches'
import { AvatarCard } from '@/routes/send-gift'
import { cn } from '@/utils'

export function BattleResultGameScreen({
  rewardTimeValue,
  rewardTimeLabel,
  starsImgSrc,
  bgSrc,
  isWinner = false,
}: {
  rewardTimeValue: number
  rewardTimeLabel: string
  starsImgSrc?: string
  bgSrc?: string
  isWinner?: boolean
}) {
  const { RiveComponent, rive } = useRive({
    src: `/riveAnimations/${isWinner ? 'winner' : 'loser'}.riv`,
    autoplay: true,
    onLoad: () => {
      // setStartRiveAnimation(true)
    },
    onPlay: () => {
      // setTimeout(() => {
      //   setStartRiveAnimation(true)
      //   setPlaceholderRiveAnimation(false)
      // }, 2000)
    },
    // onStateChange: () => {
    //   rive?.stop()
    // },
    onStop: () => {
      // setStartRiveAnimation(false)
      // setIsShowSendGiftActionButtons?.(true)
    },
  })

  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-between font-pixel bg-black/30 z-50',
        isWinner ? 'bg-[#0a1309]' : 'bg-[#110522]',
        bgSrc &&
          `bg-[url("${bgSrc}")] bg-no-repeat bg-[position:bottom_left_-0px]`,
      )}
    >
      <RiveComponent className="absolute h-full w-full top-0 left-0 z-[-1]" />
      <header className="relative w-full h-[310px] top-20">
        {starsImgSrc && (
          <img
            src={starsImgSrc}
            className="w-full h-auto p-6 object-cover bg-blend-lighten absolute opacity-0 animate-slide-up-fade-swipe-game-1"
          />
        )}
        <div
          className={cn(
            'relative overflow-hidden size-[104px] rounded-[36px] left-1/2 top-[100px] -translate-x-1/2 shadow-[0_0px_50px_rgba(182,_255,_0,_0.3)] opacity-0 animate-slide-up-fade-swipe-game-2',
            !isWinner && 'shadow-[0_0px_59.8px_rgba(140,_53,_251,_0.4)]',
          )}
        >
          <img
            src={'/roulette-icons/default.png'}
            className="w-full h-auto object-cover absolute"
          />
          <h2 className="absolute left-1/2 top-1/2 -translate-1/2 text-3xl text-white font-bold">
            NA
          </h2>
        </div>
        <div className="relative flex flex-col gap-2 items-center justify-center top-[110px]">
          {isWinner ? (
            <h2 className="relative font-pixel text-xl text-white text-center uppercase opacity-0 animate-slide-up-fade-swipe-game-3">
              ABSOLUTE
              <br />
              CHAMPION!
            </h2>
          ) : (
            <h2 className="relative font-pixel text-xl text-white text-center uppercase opacity-0 animate-slide-up-fade-swipe-game-3">
              don't worry!
            </h2>
          )}
          <h3 className="relative font-inter text-sm text-white/50 text-center opacity-0 animate-slide-up-fade-swipe-game-4">
            {isWinner
              ? 'You showed everyone how to play!'
              : "You'll be lucky next time."}
          </h3>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center gap-1 opacity-0 animate-slide-up-fade-swipe-game-5">
        <h2 className="font-inter text-sm text-white/50">
          {isWinner ? 'Your reward' : 'You lose'}:
        </h2>
        <div className="inline-flex items-center justify-center">
          <WatchesIcon
            fill={isWinner ? '#B6FF00' : '#DA364C'}
            className="size-10"
          />
          <div className="inline-flex items-baseline gap-1">
            <h1
              className={cn(
                'font-pixel text-4xl text-white',
                isWinner &&
                  '[-webkit-text-stroke:1px_rgba(182,255,0,1)] [text-shadow:0px_0px_10px_rgba(182,255,0,1)]',
                !isWinner &&
                  'bg-gradient-to-b from-[#DA364C] via-[#DA364C] to-[#A51F6D] [background-position:10.42%] bg-clip-text text-transparent',
              )}
            >
              {rewardTimeValue}
            </h1>
            <span className="text-sm text-white/50 uppercase">
              {rewardTimeLabel}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4 mt-[41px]">
            <span className="font-inter text-[14px] leading-[140%] text-[#FFFFFF]/60">
              {isWinner ? 'Loser' : 'Winner'}:
            </span>
            <AvatarCard
              className="size-[32px]"
              classNameForSpan="text-[#FFFFFF] text-[14px] pr-1"
              src="/roulette-icons/user-2.png"
              label="IM"
            />
            <span className="font-pixel text-[14px] font-[400] text-[#FFFFFF]">
              tevial
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 w-full px-4 pb-10">
        <ActionButton className="text-black active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed opacity-0 animate-slide-up-fade-swipe-game-7">
          Share and get {isWinner ? '+1 wek' : '+2 hour'}
        </ActionButton>
        <ActionButton className="text-black bg-gradient-to-b from-white to-[#999999] active:from-[#999999] active:to-[#535353] disabled:from-[#999999] disabled:to-[#535353] disabled:cursor-not-allowed uppercase opacity-0 animate-slide-up-fade-swipe-game-6">
          new battle
        </ActionButton>
      </div>
    </div>
  )
}
