import { WatchesIcon } from '@/assets/icons/watches'
import { AdsButton } from '@/components/ads/ads-button'
import { BattleResultGameBg } from '@/components/battle-page/ui/battle-result-game-bg'
import { ActionButton } from '@/components/ui/action-button'
import { AppContext } from '@/context/app-context'
import { cn } from '@/lib/utils'
import { AvatarCard } from '@/routes/send-gift'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSound from 'use-sound'
import LoosingStartImg from '/minigames/loosing-stars-battle.webp'
import WinningStarsImg from '/minigames/winning-stars-battle.webp'

export const Route = createFileRoute('/minigames/battle-result')({
  validateSearch: (search) => ({
    isDraw: Boolean(search.isDraw),
    bet: String(search.bet),
    myId: Number(search.myId),
    winnerId: Number(search.winnerId),
    winnerName: String(search.winnerName),
    winnerPhotoUrl: String(search.winnerPhotoUrl),
    loserId: Number(search.loserId),
    loserName: String(search.loserName),
    loserPhotoUrl: String(search.loserPhotoUrl),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const search = Route.useSearch()

  useEffect(() => {
    if (search.winnerId === search.myId) {
      document.body.style.backgroundColor = '#0a1309'
    } else {
      document.body.style.backgroundColor = '#110522'
    }
  }, [])

  return (
    <ResultScene
      bet={search.bet}
      isDraw={search.isDraw}
      winner={{
        id: search.winnerId,
        name: search.winnerName,
        photoUrl: search.winnerPhotoUrl,
      }}
      loser={{
        id: search.loserId,
        name: search.loserName,
        photoUrl: search.loserPhotoUrl,
      }}
      myId={Number(search.myId)}
      onNewBattle={() =>
        router.navigate({
          to: '/minigames/battle',
          search: {
            bet: undefined as unknown as number,
            invitedBy: undefined as unknown as number,
          },
        })
      }
    />
  )
}

interface IUserResultData {
  id: number
  name: string
  photoUrl: string
}

const unitsToSeconds: Record<string, number> = {
  day: 86_400,
  week: 604_800,
  month: 2_628_000,
  year: 30_154_000,
}

const ResultScene = ({
  bet,
  onNewBattle,
  isDraw = false,
  winner,
  loser,
  myId,
}: {
  winner: IUserResultData
  loser: IUserResultData
  bet?: string
  onNewBattle?: () => void
  isDraw?: boolean
  myId?: number
}) => {
  const { t } = useTranslation()
  const rewardTimeValue = bet

  const rewardTimeValueToAdd = useMemo(() => {
    if (!bet) {
      return unitsToSeconds['day']
    }

    const [time, unit] = bet?.split(' ')
    const t = Number(time) * unitsToSeconds[unit]

    return t
  }, [bet])

  const [disableAdsButton, setDisableAdsButton] = useState(false)

  const [isNewBattleDisabled, setIsNewBattleDisabled] = useState(true)

  const [playBattleLoser, { stop: stopBattleLoser }] = useSound(
    '/sounds/Battle-Loser.aac',
  )

  const [playBattleWinner, { stop: stopBattleWinner }] = useSound(
    '/sounds/Swipe-End.aac',
  )

  const { setIsBattleGameBackgroundMusicActive } = useContext(AppContext)

  const isMeWinner = useMemo(() => {
    if (isDraw) return false
    return winner.id === myId
  }, [isDraw, winner, myId])

  useEffect(() => {
    setIsBattleGameBackgroundMusicActive(false)
    if (isMeWinner) {
      playBattleWinner()
    } else {
      playBattleLoser()
    }
    return () => {
      stopBattleWinner()
      stopBattleLoser()
    }
  }, [playBattleWinner, playBattleLoser])

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 top-0 h-screen flex flex-col items-center justify-between font-pixel bg-black/30 z-50 max-w-[450px] w-full',
        isMeWinner ? 'bg-[#0a1309]' : 'bg-[#110522]',
      )}
    >
      <BattleResultGameBg
        className={cn(
          'absolute inset-0 -z-10',
          isMeWinner && 'rotate-180 bg-[#0a1309]',
        )}
        glowColor={isMeWinner ? '#22d082' : undefined}
        gradColor1={isMeWinner ? 'rgba(26, 121, 79, 0)' : undefined}
        gradColor2={isMeWinner ? '#22d082' : undefined}
        gradColor3={isMeWinner ? '#dee11a' : undefined}
      />
      <div className="absolute top-[-10px] left-0 w-full h-screen backdrop-blur-[4px] opacity-50" />
      <div className="absolute bottom-0 max-h-[1200px] w-full h-full flex flex-col justify-between">
        <header className="relative w-full h-[310px] top-20">
          {/* {isMeWinner && ( */}
          <img
            src={isMeWinner ? WinningStarsImg : LoosingStartImg}
            className="w-full h-auto object-cover bg-blend-lighten absolute -top-15 opacity-0 animate-slide-up-fade-swipe-game-1"
          />
          {/* // )} */}
          <div
            className={cn(
              'relative overflow-hidden size-[104px] rounded-[36px] left-1/2 top-[100px] -translate-x-1/2 shadow-[0_0px_50px_rgba(182,_255,_0,_0.3)] opacity-0 animate-slide-up-fade-swipe-game-2',
              !isMeWinner && 'shadow-[0_0px_59.8px_rgba(140,_53,_251,_0.4)]',
            )}
          >
            <img
              src={
                isDraw
                  ? winner.id === myId
                    ? winner.photoUrl
                    : loser.photoUrl
                  : isMeWinner
                    ? winner.photoUrl
                    : loser.photoUrl || '/roulette-icons/default.webp'
              }
              className="w-full h-auto object-cover absolute"
            />
          </div>
          <div className="relative flex flex-col gap-2 items-center justify-center top-[110px]">
            {isMeWinner ? (
              <h2 className="relative font-pixel text-[24px] text-white text-center uppercase opacity-0 animate-slide-up-fade-swipe-game-3">
                {t('battle-result.title.winner.line1')}
                <br />
                {t('battle-result.title.winner.line2')}
              </h2>
            ) : (
              <h2 className="relative font-pixel text-[24px] text-white text-center uppercase opacity-0 animate-slide-up-fade-swipe-game-3">
                {t('battle-result.title.loser')}
              </h2>
            )}
            <h3 className="relative font-inter text-sm text-white/50 text-center opacity-0 animate-slide-up-fade-swipe-game-4">
              {isMeWinner
                ? t('battle-result.subtitle.winner')
                : t('battle-result.subtitle.loser')}
            </h3>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center opacity-0 animate-slide-up-fade-swipe-game-5">
          <h2 className="font-inter text-sm text-white/50 mb-[-5px]">
            {isMeWinner
              ? t('battle-result.reward.winner')
              : t('battle-result.reward.loser')}
            :
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
                  'text-[#B6FF00] [text-shadow:0px_0px_10px_rgba(182,255,0,1)]',
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
          {!isDraw && (
            <div>
              <div className="flex items-center gap-4 mt-[41px]">
                <span className="font-inter text-sm leading-[140%] text-[#FFFFFF]/60">
                  {isMeWinner
                    ? t('battle-result.opponent.loser')
                    : t('battle-result.opponent.winner')}
                  :
                </span>
                <AvatarCard
                  className="size-[32px]"
                  classNameForSpan="text-[#FFFFFF] text-sm pr-1"
                  src={
                    isMeWinner
                      ? loser.photoUrl
                      : winner.photoUrl || '/roulette-icons/user-2.webp'
                  }
                  label={''}
                />
                <span className="font-pixel text-sm font-[400] text-[#FFFFFF] uppercase">
                  {isMeWinner ? loser.name : winner.name}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-2 w-full px-4 pb-10">
          {!isMeWinner ? (
            <AdsButton
              // time={isMeWinner ? 604800 : 7200}
              time={rewardTimeValueToAdd * 0.8}
              displayPercent={20}
              disabled={disableAdsButton || isNewBattleDisabled}
              onAnimationEnd={() => setIsNewBattleDisabled(false)}
              isPercent
              onBtnClick={() => {
                setTimeout(() => {
                  setDisableAdsButton(true)
                }, 30000)
              }}
              onReward={() => {
                // setTimeout(() => {
                //   window.location.reload()
                // }, 2000)
              }}
              className="opacity-0 animate-slide-up-fade-swipe-game-6 bg-gradient-to-b from-[#8C35FB] to-[#6602E7] text-white disabled:cursor-not-allowed disabled:from-[#4a1c87] disabled:to-[#3b0188] disabled:text-white/40"
            />
          ) : null}
          <div className="inline-flex gap-2 w-full">
            <Link
              to="/minigames/battle"
              className="w-full"
              search={{
                bet: undefined as unknown as number,
                invitedBy: undefined as unknown as number,
              }}
            >
              <ActionButton
                onClick={onNewBattle}
                disabled={isNewBattleDisabled}
                onAnimationEnd={() => setIsNewBattleDisabled(false)}
                className="text-black bg-gradient-to-b from-white to-[#999999] active:from-[#999999] active:to-[#535353] disabled:cursor-not-allowed uppercase opacity-0 animate-slide-up-fade-swipe-game-7"
              >
                {t('battle-result.buttons.close')}
              </ActionButton>
            </Link>
            <ActionButton
              onClick={onNewBattle}
              disabled={isNewBattleDisabled}
              onAnimationEnd={() => setIsNewBattleDisabled(false)}
              className="text-black bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00] uppercase opacity-0 animate-slide-up-fade-swipe-game-7"
            >
              {t('battle-result.buttons.new-battle')}
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}
