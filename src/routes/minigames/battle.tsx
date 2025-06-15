import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { shareURL } from '@telegram-apps/sdk'
import { AvatarCard } from '../send-gift'
import { PageLayout } from '@/components/ui/page-layout'
import {
  BattleGameRewardSection,
  BattleTitle,
} from '@/components/battle-page/battle-preview-screen'
import { BattleCard } from '@/components/battle-page/opponent-battle-card'
import { ActionButton } from '@/components/ui/action-button'
import { cn } from '@/utils'
import { BattleBustButtons } from '@/components/battle-page/battle-bust-buttons'
import { WatchesIcon } from '@/assets/icons/watches'
import WinningStartImg from '/minigames/winning-stars.png'
import { BattleResultGameBg } from '@/components/battle-page/battle-result-game-bg'
import { CountdownStartGame } from '@/components/minigames/countdown-start-game'
import { BattleScene } from '@/components/battle-page/battle-scene'
import { BattleGameControlsPanel } from '@/components/battle-page/battle-game-controls-panel'

export const Route = createFileRoute('/minigames/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isAnimationsEnd, setIsAnimationsEnd] = useState(false)

  useEffect(() => {
    document.body.style.backgroundColor = '#03061a'
    return () => {
      document.body.style.backgroundColor = '#121312'
    }
  }, [])
  const [isClosingAnimation, setIsClosingAnimation] = useState(false)
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false)
  const [isOpeningAnimationDelayed, setIsOpeningAnimationDelayed] =
    useState(false)
  const [isReset, setIsReset] = useState(true)

  // Don't delete
  const [isStartFindingOpponent, setIsStartFindingOpponent] = useState(false)
  const [
    isStartFindingOpponentAnimationEnd,
    setIsStartFindingOpponentAnimationEnd,
  ] = useState(false)
  const [isWinningResult, setIsWinningResult] = useState(false)
  const [isMeWinner, setIsMeWinner] = useState(false)

  const resetGame = () => {
    setIsStartFindingOpponent(false)
    setIsStartFindingOpponentAnimationEnd(false)
    setIsWinningResult(false)
    setIsMeWinner(false)
    setIsReset(true)
  }

  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (isStartFindingOpponent) {
      timeoutRef.current = window.setTimeout(() => {
        setIsClosingAnimation(true)
      }, 1000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isStartFindingOpponent])

  useEffect(() => {
    if (isOpeningAnimation) {
      timeoutRef.current = window.setTimeout(() => {
        setIsOpeningAnimationDelayed(true)
      }, 5000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isOpeningAnimation])

  useEffect(() => {
    if (!isWinningResult) return
    if (isReset) {
      document.body.style.backgroundColor = '#03061a'
      return
    }
    document.body.style.backgroundColor = isMeWinner ? '#0a1309' : '#110522'
    return () => {
      document.body.style.backgroundColor = '#03061a'
    }
  }, [isMeWinner, isReset, isWinningResult])

  const [areaClaimedPercent, setAreaClaimedPercent] = useState(0)

  useEffect(() => {
    if (areaClaimedPercent >= 80 || areaClaimedPercent <= -80) {
      setIsMeWinner(areaClaimedPercent >= 80)
      setIsWinningResult(true)
    }
  }, [areaClaimedPercent])

  return (
    <PageLayout
      useFooter={false}
      className="flex flex-col justify-between bg-transparent pb-0 overflow-hidden"
      classNameContent="flex flex-col justify-between flex-1"
    >
      {!isWinningResult && !isStartFindingOpponentAnimationEnd && (
        <IntroScene
          className="flex-1"
          onFindingOpponent={() => {
            setIsStartFindingOpponent(true)
            setIsStartFindingOpponentAnimationEnd(true)
            setIsReset(false)
          }}
          onAnimationEnd={(params) => {
            if (params.animationName === 'battle-intro-section-slide-fade')
              setIsAnimationsEnd(true)
          }}
        />
      )}
      {isStartFindingOpponent && (
        <MainScene
          onForcedExitBattle={resetGame}
          onAreaClaimedPercentageChange={(percent) =>
            setAreaClaimedPercent(percent)
          }
        />
      )}
      {isWinningResult && (
        <ResultScene
          nickname="tevial"
          bet="1 week"
          isMeWinner={isMeWinner}
          onNewBattle={resetGame}
        />
      )}
    </PageLayout>
  )
}

const IntroScene = ({
  onFindingOpponent,
  className,
  onAnimationEnd,
}: {
  onFindingOpponent?: () => void
  className?: string
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
}) => {
  const [isAnimationsBustButtonsEnd, setIsAnimationsBustButtonsEnd] =
    useState(false)

  const [isAnimationsFindButtonEnd, setIsAnimationsFindButtonEnd] =
    useState(false)

  const [isIntroSceneAnimationsStart, setIsIntroSceneAnimationsStart] =
    useState(false)

  return (
    <div
      className={cn(
        'flex flex-col justify-between',
        isIntroSceneAnimationsStart &&
          '!animate-battle-intro-section-slide-fade-out',
        className,
      )}
      onAnimationEnd={(e) => {
        onAnimationEnd?.(e)
        if (e.animationName === 'battle-intro-section-slide-fade-out') {
          onFindingOpponent?.()
        }
      }}
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
        <BattleCard
          showElectricsLines={false}
          nickname="tevial"
          className="opacity-0 animate-battle-intro-slide-card-fade"
        />
      </header>
      <div className="flex-1">
        <BattleGameRewardSection />
        <BattleBustButtons
          className={cn(
            'opacity-0 animate-battle-preview-bust-fade',
            !isAnimationsBustButtonsEnd && 'pointer-events-none',
          )}
          onAnimationEnd={() => setIsAnimationsBustButtonsEnd(true)}
        />
      </div>
      <div className="px-4">
        <p className="font-inter text-[#FFFFFF]/40 text-[14px] font-[400] leading-[140%] text-center mb-4 opacity-0 animate-battle-preview-find-text-fade">
          The opponent will be <br /> randomly selected. Commission 1%
        </p>
        <ActionButton
          onClick={() => {
            setIsIntroSceneAnimationsStart(true)
          }}
          className={cn(
            'font-pixel text-[#121312] rounded-[16px] uppercase opacity-0 animate-battle-preview-find-button-fade',
            !isAnimationsFindButtonEnd && 'pointer-events-none',
          )}
          onAnimationEnd={() => setIsAnimationsFindButtonEnd(true)}
        >
          finding the opponent
        </ActionButton>
      </div>
    </div>
  )
}

const MainScene = ({
  onAreaClaimedPercentageChange,
  onForcedExitBattle,
}: {
  onAreaClaimedPercentageChange?: (percent: number) => void
  onForcedExitBattle?: () => void
}) => {
  const [
    isForcedExitBattleAnimationFinished,
    setIsForcedExitBattleAnimationFinished,
  ] = useState(false)

  const opponentNickname = 'igorivanov'
  const myNickname = 'tevial'

  const [isStartFindingOpponent, setIsStartFindingOpponent] = useState(true) // true
  const [isClosingAnimation, setIsClosingAnimation] = useState(false) // false
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false) // false
  const [isMorphAnimation, setIsMorphAnimation] = useState(false) // false
  const [isCardBgAnimationStart, setIsCardBgAnimationStart] = useState(false) // false
  const [isStartCountdown, setIsStartCountdown] = useState(false) // false
  const [isCountdownCompleted, setIsCountdownCompleted] = useState(false) // false

  const [areaClaimedPercentage, setAreaClaimedPercentage] = useState(0)
  const [isBoostActive, setIsBoostActive] = useState(false)

  const timeouts = useRef<Array<number>>([])

  useEffect(() => {
    const addTimeout = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay)
      timeouts.current.push(id)
    }

    addTimeout(() => setIsStartFindingOpponent(false), 5000)

    addTimeout(() => setIsClosingAnimation(true), 5500)
    addTimeout(() => setIsOpeningAnimation(true), 9000)
    addTimeout(() => setIsMorphAnimation(true), 10500)
    addTimeout(() => setIsCardBgAnimationStart(true), 10500)
    addTimeout(() => setIsStartCountdown(true), 15000)

    if (isBoostActive) {
      addTimeout(() => setIsBoostActive(false), 8000)
    }

    return () => {
      timeouts.current.forEach(clearTimeout)
    }
  }, [isBoostActive])

  // bot
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isCountdownCompleted) return

    const clickBot = () => {
      // 👉 логика клика
      setAreaClaimedPercentage((prev: number) => prev - 1)

      // Устанавливаем новую случайную задержку
      const delay = 100 + Math.random() * 100

      intervalRef.current = window.setTimeout(clickBot, delay)
    }

    clickBot() // запуск

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isCountdownCompleted])

  useEffect(() => {
    onAreaClaimedPercentageChange?.(areaClaimedPercentage)
  }, [areaClaimedPercentage])

  return (
    <>
      <header
        className={cn(
          'font-pixel font-[400] text-center',
          // isFinalAnimationBeforeGame &&
          // '!animate-battle-finding-button-fade-out',
          // isTranslateCardsAnimationStart && 'hidden',
        )}
      >
        <BattleTitle
          className={'opacity-0 animate-battle-preview-title-fade'}
          text={
            !isMorphAnimation ? 'Finding the opponent' : 'An opponent was found'
            // 'Finding the opponent'
          }
        />
      </header>
      <div className="flex flex-col gap-2 justify-between flex-1">
        <div className="relative flex flex-col h-full flex-1 items-center justify-between mask-[linear-gradient(to_bottom,transparent_0%,black_1%,black_99%,transparent_100%)]">
          <BattleCard
            isFindingUser={isStartFindingOpponent}
            nickname={opponentNickname}
            isMe={false}
            isRow={isMorphAnimation}
            isBgVisible={!isCardBgAnimationStart}
            className={cn(
              'transition-all duration-5000 animate-battle-finding-slide-top-fade',
              isClosingAnimation &&
                !isOpeningAnimation &&
                'flex-1 min-h-[220px]',
              isOpeningAnimation && 'h-[54px]',
            )}
            classNameBg={cn(
              'transition-all duration-3000 delay-1500',
              isOpeningAnimation && 'opacity-0',
            )}
          />
          {isStartCountdown && !isCountdownCompleted && (
            <CountdownStartGame
              onComplete={() => {
                setIsCountdownCompleted(true)
                // setIsCountdownStarted(false)
                // setAutoClick(true)
              }}
            />
          )}

          {isCountdownCompleted && (
            <BattleScene areaClaimedUnits={areaClaimedPercentage} />
          )}

          {/* <BattleAnimatedMiddleLine
            className={cn(
              'absolute top-1/2 left-1/2 -translate-1/2 z-1 w-[calc(100%-50px)] opacity-0 animate-battle-finding-versus-fade',
            )}
            classNameForLine={cn(
              'opacity-0',
              // isClosingAnimation &&
              //   'animate-battle-finding-line-width-fade-in-out',
            )}
            onAnimationEnd={() => {
              // setIsClosingAnimation(false)
              // setIsMorphAnimation(true)
              // setIsOpeningAnimation(true)
            }}
          /> */}
          <BattleCard
            nickname={myNickname}
            isRow={isMorphAnimation}
            isBgVisible={!isCardBgAnimationStart}
            className={cn(
              'transition-all duration-5000 w-full h-[220px] animate-battle-finding-slide-bottom-fade',
              isClosingAnimation &&
                !isOpeningAnimation &&
                'flex-1 min-h-[220px]',
              isOpeningAnimation && 'h-[54px]',
            )}
            classNameBg={cn(
              'transition-all duration-3000 delay-1500',
              isOpeningAnimation && 'opacity-0',
            )}
          />
        </div>
        <div
          className={cn(
            'transition-all duration-4000 delay-1300 h-0',
            isOpeningAnimation && 'h-[160px]',
          )}
        >
          {isCountdownCompleted && (
            <BattleGameControlsPanel
              onClick={() => {
                const addUnits = isBoostActive ? 2 : 1
                setAreaClaimedPercentage((prev) => prev + addUnits)
              }}
              onBoostActivate={() => setIsBoostActive(true)}
            />
          )}
        </div>
      </div>
      <div
        className={cn(
          'transition-all duration-4000 delay-1300 px-4 h-[56px]',
          isOpeningAnimation && 'h-0',
        )}
      >
        {isStartFindingOpponent && (
          <ActionButton
            disabled={
              !isForcedExitBattleAnimationFinished || !isStartFindingOpponent
            }
            onClick={onForcedExitBattle}
            className={cn(
              'h-full bg-gradient-to-b from-[#FFFFFF] to-[#999999] opacity-0 animate-fade-in',
            )}
            onAnimationEnd={() => setIsForcedExitBattleAnimationFinished(true)}
          >
            <span className="font-pixel text-[#121312] font-[400] uppercase text-[18px] leading-[24px]">
              close
            </span>
          </ActionButton>
        )}
      </div>
      {/* </div> */}
    </>
  )
}

const ResultScene = ({
  nickname = 'Unknown',
  bet,
  onNewBattle,
  isMeWinner = false,
}: {
  nickname?: string
  bet?: string
  onNewBattle?: () => void
  isMeWinner?: boolean
}) => {
  // return (
  //   <BattleResultGameScreen
  //     rewardTimeValue={battleGameRewardRadioValue.split(' ')[0]}
  //     rewardTimeLabel={battleGameRewardRadioValue.split(' ')[1]}
  //   />
  // )
  // флаг, указывающий, что анимация закончилась
  // const [animationEnded, setAnimationEnded] = useState(false)

  // обработчик конца анимации
  // const onAnimationEnd = () => {
  //   setAnimationEnded(true)
  // }

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
              NA
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
                label={nickname.slice(0, 2)}
              />
              <span className="font-pixel text-sm font-[400] text-[#FFFFFF] uppercase">
                {nickname}
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
