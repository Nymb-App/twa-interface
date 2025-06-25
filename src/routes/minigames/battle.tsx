import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Countdown from 'react-countdown'
import { PageLayout } from '@/components/ui/page-layout'
import {
  BattleGameRewardSection,
  BattleTitle,
} from '@/components/battle-page/battle-preview-screen'
import { BattleCard } from '@/components/battle-page/opponent-battle-card'
import { ActionButton } from '@/components/ui/action-button'
import { cn } from '@/utils'
import { BattleBustButtons } from '@/components/battle-page/battle-bust-buttons'
import { CountdownStartGame } from '@/components/minigames/countdown-start-game'
import { BattleScene } from '@/components/battle-page/battle-scene'
import { BattleGameControlsPanel } from '@/components/battle-page/battle-game-controls-panel'
import { AppContext } from '@/context/app-context'
import { BattleAnimatedMiddleLine } from '@/components/battle-page/battle-animated-middle-line'

export const Route = createFileRoute('/minigames/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  const [, setIsAnimationsEnd] = useState(false)

  useEffect(() => {
    document.body.style.backgroundColor = '#03061a'
    return () => {
      document.body.style.backgroundColor = '#121312'
    }
  }, [])
  const [, setIsClosingAnimation] = useState(false)
  const [isOpeningAnimation] = useState(false)
  const [, setIsOpeningAnimationDelayed] = useState(false)
  const [, setIsReset] = useState(true)

  // Don't delete
  const { battleGameRewardRadioValue } = useContext(AppContext)
  const [isStartFindingOpponent, setIsStartFindingOpponent] = useState(false)
  const [
    isStartFindingOpponentAnimationEnd,
    setIsStartFindingOpponentAnimationEnd,
  ] = useState(false)
  const [isWinningResult, setIsWinningResult] = useState(false)
  const [isMeWinner, setIsMeWinner] = useState(false)
  const [areaClaimedPercent, setAreaClaimedPercent] = useState(0)
  const router = useRouter()

  const opponentNickname = 'igorivanov'
  const myNickname = 'tevial'

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
    if (areaClaimedPercent === 0) {
      document.body.style.backgroundColor = '#03061a'
    }

    if (areaClaimedPercent > 0) {
      document.body.style.backgroundColor = '#0a1309'
    }

    if (areaClaimedPercent < 0) {
      document.body.style.backgroundColor = '#110522'
    }
  }, [areaClaimedPercent])

  useEffect(() => {
    if (areaClaimedPercent >= 80 || areaClaimedPercent <= -80) {
      setIsMeWinner(areaClaimedPercent >= 80)
      setIsWinningResult(true)
      router.navigate({
        to: '/minigames/battle-result',
        search: {
          myNickname: myNickname,
          opponentNickname: opponentNickname,
          isMeWinner: isMeWinner,
          bet: battleGameRewardRadioValue,
        },
      })
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
          areaClaimedPercent={areaClaimedPercent}
          onForcedExitBattle={resetGame}
          onAreaClaimedPercentageChange={(percent) =>
            setAreaClaimedPercent(percent)
          }
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
          className="opacity-0 animate-battle-preview-title-fade mb-4"
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
  areaClaimedPercent = 0,
  onAreaClaimedPercentageChange,
  onForcedExitBattle,
}: {
  areaClaimedPercent?: number
  onAreaClaimedPercentageChange?: (percent: number) => void
  onForcedExitBattle?: () => void
}) => {
  const [
    isForcedExitBattleAnimationFinished,
    setIsForcedExitBattleAnimationFinished,
  ] = useState(false)

  const opponentNickname = 'igorivanov'
  const myNickname = 'tevial'

  const { battleGameRewardRadioValue } = useContext(AppContext)
  const [isStartFindingOpponent, setIsStartFindingOpponent] = useState(true) // true
  const [isVersusAnimationStart, setIsVersusAnimationStart] = useState(false) // false
  const [isClosingAnimation, setIsClosingAnimation] = useState(false) // false
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false) // false
  const [isMorphAnimation, setIsMorphAnimation] = useState(false) // false
  const [isCardBgAnimationStart, setIsCardBgAnimationStart] = useState(false) // false
  const [isStartCountdown, setIsStartCountdown] = useState(false) // false
  const [isCountdownCompleted, setIsCountdownCompleted] = useState(false) // false

  const [areaClaimedPercentage, setAreaClaimedPercentage] = useState(0)

  const [isBoostActive0, setIsBoostActive0] = useState(false)
  const [isBoostActive1, setIsBoostActive1] = useState(false)

  const countdownTarget = useMemo(
    () => Date.now() + 60000,
    [isCountdownCompleted],
  )

  const router = useRouter()

  const timeouts = useRef<Array<number>>([])

  const addTimeout = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timeouts.current.push(id)
  }

  useEffect(() => {
    addTimeout(() => setIsStartFindingOpponent(false), 5000)
    addTimeout(() => setIsVersusAnimationStart(true), 1000)
    addTimeout(() => setIsClosingAnimation(true), 5500)
    addTimeout(() => setIsOpeningAnimation(true), 9000)
    addTimeout(() => setIsMorphAnimation(true), 10500)
    addTimeout(() => setIsCardBgAnimationStart(true), 10500)
    addTimeout(() => setIsStartCountdown(true), 15000)

    if (isBoostActive0 || isBoostActive1) {
      addTimeout(() => {
        setIsBoostActive0(false)
        setIsBoostActive1(false)
      }, 8000)
    }

    return () => {
      timeouts.current.forEach(clearTimeout)
    }
  }, [isBoostActive0, isBoostActive1])

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
      <header className={cn('font-pixel font-[400] text-center min-h-[52px]')}>
        {!isStartCountdown ? (
          <BattleTitle
            className={cn('opacity-0 animate--battle-main-scene-title-fade')}
            text={
              isStartFindingOpponent
                ? 'Finding the opponent'
                : 'An opponent was found'
            }
          />
        ) : (
          <dl className="flex justify-evenly text-center w-full font-[400] text-[14px] font-inter opacity-0 animate-battle-preview-title-fade">
            <div>
              <dt className="leading-[120%] text-[14px] text-[#FFFFFF]/40 mb-4">
                Winning:
              </dt>
              <dd className="leading-[120%] text-[#B6FF00] text-shadow-[0px_0px_8px_#B6FF00] mr-2 font-pixel mt-[-9px] uppercase">
                <span className="mr-1 text-lg">
                  {battleGameRewardRadioValue.split(' ')[0]}
                </span>
                <span className="text-xs">
                  {battleGameRewardRadioValue.split(' ')[1]}
                </span>
              </dd>
            </div>
            <div>
              <dt className="leading-[120%] text-[14px] text-[#FFFFFF]/40 mb-2">
                There's time:
              </dt>
              <dd className="text-[20px] leading-[24px] text-[#FFFFFF] font-pixel">
                {!isCountdownCompleted && <span>01:00</span>}

                {isCountdownCompleted && (
                  <Countdown
                    key={'game-timer'}
                    date={countdownTarget}
                    intervalDelay={1000}
                    precision={0}
                    onComplete={() => {
                      router.navigate({
                        to: '/minigames/battle-result',
                        search: {
                          myNickname: myNickname,
                          opponentNickname: opponentNickname,
                          isMeWinner: Boolean(areaClaimedPercent > 0),
                          bet: battleGameRewardRadioValue,
                        },
                      })
                    }}
                    renderer={({ minutes, seconds }) => (
                      <span>
                        {minutes.toString().padStart(2, '0')}:
                        {seconds.toString().padStart(2, '0')}
                      </span>
                    )}
                  />
                )}
              </dd>
            </div>
          </dl>
        )}
      </header>
      <div className="flex flex-col gap-2 justify-between flex-1">
        <div className="relative flex flex-col h-full flex-1 items-center justify-between mask-[linear-gradient(to_bottom,transparent_0%,black_1%,black_99%,transparent_100%)]">
          <BattleCard
            isFindingUser={isStartFindingOpponent}
            nickname={opponentNickname}
            isMe={false}
            areaClaimedPercent={areaClaimedPercent}
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
              }}
            />
          )}

          {isCountdownCompleted && (
            <BattleScene areaClaimedUnits={areaClaimedPercentage} />
          )}

          <BattleAnimatedMiddleLine
            className={cn(
              'absolute top-1/2 left-1/2 -translate-1/2 z-1 w-[calc(100%-50px)] opacity-0 transition-all duration-600',
              isVersusAnimationStart && 'opacity-100',
              isOpeningAnimation && 'opacity-0 delay-1500',
            )}
            classNameForLine={cn(
              'opacity-0 w-0 transition-all',
              isClosingAnimation &&
                'w-full opacity-100 delay-1500 duration-1500',
              isOpeningAnimation && 'w-0 opacity-0 delay-600 duration-1500',
            )}
          />
          <BattleCard
            nickname={myNickname}
            isRow={isMorphAnimation}
            isBgVisible={!isCardBgAnimationStart}
            areaClaimedPercent={areaClaimedPercent}
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
          {(isStartCountdown || isCountdownCompleted) && (
            <BattleGameControlsPanel
              disabled={!isCountdownCompleted}
              onClick={() => {
                const addUnits = isBoostActive0 || isBoostActive1 ? 2 : 1
                setAreaClaimedPercentage((prev) => prev + addUnits)
              }}
              onBoostActivate={() => {
                if (!isBoostActive0) {
                  setIsBoostActive0(true)
                }
                if (!isBoostActive1) {
                  setIsBoostActive1(true)
                }
              }}
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
