import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { shareURL } from '@telegram-apps/sdk'
import { WatchesIcon } from '@/assets/icons/watches'
import { BattleResultGameBg } from '@/components/battle-page/battle-result-game-bg'
import { cn } from '@/utils'
import { AvatarCard } from '@/routes/send-gift'
import { ActionButton } from '@/components/ui/action-button'
import WinningStartImg from '/minigames/winning-stars.png'

export const Route = createFileRoute('/minigames/battle-result')({
  validateSearch: (search) => ({
    myNickname: String(search.myNickname ?? ''),
    opponentNickname: String(search.opponentNickname ?? ''),
    isMeWinner: Boolean(search.isMeWinner),
    bet: String(search.bet ?? ''),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const search = Route.useSearch()

  useEffect(() => {
    if (search.isMeWinner) {
      document.body.style.backgroundColor = '#0a1309'
    } else {
      document.body.style.backgroundColor = '#110522'
    }
  }, [])

  return (
    <ResultScene
      myNickname={search.myNickname}
      opponentNickname={search.opponentNickname}
      bet={search.bet}
      isMeWinner={search.isMeWinner}
      onNewBattle={() => router.navigate({ to: '/minigames/battle' })}
    />
  )
}

const ResultScene = ({
  myNickname = 'Unknown',
  opponentNickname = 'Unknown',
  bet,
  onNewBattle,
  isMeWinner = false,
}: {
  myNickname?: string
  opponentNickname?: string
  bet?: string
  onNewBattle?: () => void
  isMeWinner?: boolean
}) => {
  const rewardTimeValue = bet

  const [isShareBattleDisabled, setIsShareBattleDisabled] = useState(true)
  const [isNewBattleDisabled, setIsNewBattleDisabled] = useState(true)

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 top-0 h-screen flex flex-col items-center justify-between font-pixel bg-black/30 z-50 max-w-[450px] w-full',
        isMeWinner ? 'bg-[#0a1309]' : 'bg-[#110522]',
      )}
    >
      <BattleResultGameBg
        className={cn(isMeWinner && 'rotate-180 bg-[#0a1309]')}
        glowColor={isMeWinner ? '#22d082' : undefined}
        gradColor1={isMeWinner ? 'rgba(26, 121, 79, 0)' : undefined}
        gradColor2={isMeWinner ? '#22d082' : undefined}
        gradColor3={isMeWinner ? '#dee11a' : undefined}
      />
      <div className="absolute top-[-10px] left-0 w-full h-screen backdrop-blur-[4px] opacity-50" />
      <div className="absolute bottom-0 max-h-[1200px] w-full h-full flex flex-col justify-between">
        <header className="relative w-full h-[310px] top-20">
          {isMeWinner && (
            <img
              src={WinningStartImg}
              className="w-full h-auto p-6 object-cover bg-blend-lighten absolute opacity-0 animate-slide-up-fade-swipe-game-1"
            />
          )}
          <div
            className={cn(
              'relative overflow-hidden size-[104px] rounded-[36px] left-1/2 top-[100px] -translate-x-1/2 shadow-[0_0px_50px_rgba(182,_255,_0,_0.3)] opacity-0 animate-slide-up-fade-swipe-game-2',
              !isMeWinner && 'shadow-[0_0px_59.8px_rgba(140,_53,_251,_0.4)]',
            )}
          >
            <img
              src={'/roulette-icons/default.png'}
              className="w-full h-auto object-cover absolute"
            />
            <h2 className="absolute left-1/2 top-1/2 -translate-1/2 text-3xl text-white font-bold">
              {myNickname.slice(0, 2)}
            </h2>
          </div>
          <div className="relative flex flex-col gap-2 items-center justify-center top-[110px]">
            {isMeWinner ? (
              <h2 className="relative font-pixel text-[24px] text-white text-center uppercase opacity-0 animate-slide-up-fade-swipe-game-3">
                ABSOLUTE
                <br />
                CHAMPION!
              </h2>
            ) : (
              <h2 className="relative font-pixel text-sm text-white text-center uppercase opacity-0 animate-slide-up-fade-swipe-game-3">
                don't worry!
              </h2>
            )}
            <h3 className="relative font-inter text-sm text-white/50 text-center opacity-0 animate-slide-up-fade-swipe-game-4">
              {isMeWinner
                ? 'You showed everyone how to play!'
                : "You'll be lucky next time."}
            </h3>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center opacity-0 animate-slide-up-fade-swipe-game-5">
          <h2 className="font-inter text-sm text-white/50 mb-[-5px]">
            {isMeWinner ? 'Your reward' : 'You lose'}:
          </h2>
          <div className="inline-flex items-center justify-center">
            <WatchesIcon
              fill={isMeWinner ? '#B6FF00' : '#DA364C'}
              className={cn(
                'size-13',
                String(rewardTimeValue).startsWith('1') && 'mr-[-18px]',
              )}
            />
            <div className="inline-flex items-baseline gap-1">
              <h1
                className={cn(
                  'font-pixel text-[48px] text-white',
                  isMeWinner &&
                    '[-webkit-text-stroke:1px_rgba(182,255,0,1)] [text-shadow:0px_0px_10px_rgba(182,255,0,1)]',
                  !isMeWinner &&
                    'bg-gradient-to-b from-[#DA364C] via-[#DA364C] to-[#A51F6D] [background-position:10.42%] bg-clip-text text-transparent',
                )}
              >
                {bet?.split(' ')[0]}
              </h1>
              <span className="text-base text-white/50 uppercase">
                {bet?.split(' ')[1]}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 mt-[41px]">
              <span className="font-inter text-sm leading-[140%] text-[#FFFFFF]/60">
                {isMeWinner ? 'Loser' : 'Winner'}:
              </span>
              <AvatarCard
                className="size-[32px]"
                classNameForSpan="text-[#FFFFFF] text-sm pr-1"
                src="/roulette-icons/user-2.png"
                label={opponentNickname.slice(0, 2)}
              />
              <span className="font-pixel text-sm font-[400] text-[#FFFFFF] uppercase">
                {opponentNickname}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 w-full px-4 pb-10">
          <ActionButton
            onClick={() => {
              const telegramLink =
                import.meta.env.VITE_TELEGRAM_APP_LINK ||
                'https://telegram-apps.com'
              if (shareURL.isAvailable()) {
                shareURL(telegramLink, 'Check out this cool app!')
              }
            }}
            disabled={isShareBattleDisabled}
            onAnimationEnd={() => setIsShareBattleDisabled(false)}
            className="text-black active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed opacity-0 animate-slide-up-fade-swipe-game-6"
          >
            Share and get {isMeWinner ? '+1 week' : '+2 hour'}
          </ActionButton>
          <ActionButton
            onClick={onNewBattle}
            disabled={isNewBattleDisabled}
            onAnimationEnd={() => setIsNewBattleDisabled(false)}
            className="text-black bg-gradient-to-b from-white to-[#999999] active:from-[#999999] active:to-[#535353] disabled:cursor-not-allowed uppercase opacity-0 animate-slide-up-fade-swipe-game-7"
          >
            new battle
          </ActionButton>
        </div>
      </div>
    </div>
  )
}
