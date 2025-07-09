import { useRouter } from '@tanstack/react-router'
import Countdown from 'react-countdown'
import { useContext, useEffect, useRef, useState } from 'react'
import { ActionButton } from '../ui/action-button'
import { CountdownStartGame } from '../minigames/countdown-start-game'
import { BattleGameControlsPanel } from './battle-game-controls-panel'
import { BattleCard } from './battle-card'
import { BattleAnimatedMiddleLine } from './ui/battle-animated-middle-line'
import { BattleScene } from './battle-scene'
import { BattleTitle } from './battle-preview-screen'
import type { TOpponentUserData } from './battle-intro-scene'
import { cn } from '@/utils'
import { AppContext } from '@/context/app-context'

const betConverter: any = {
  '86400': 'days',
  '604800': 'weeks',
  '2592000': 'months',
  '31536000': 'years',
}

export const BattleMainScene = ({
  areaClaimedPercent = 0,
  onAreaClaimedPercentageChange,
  onForcedExitBattle,
  opponentInfo,
  myInfo,
  onBattleClick,
  onCountdownCompleted,
  onGameFinished,
  myLastOpponent,
}: {
  areaClaimedPercent?: number
  onAreaClaimedPercentageChange?: (percent: number) => void
  onForcedExitBattle?: () => void
  opponentInfo: TOpponentUserData | null
  myInfo: TOpponentUserData | null
  onBattleClick?: (isX2Active: boolean) => void
  onCountdownCompleted?: () => void
  onGameFinished?: () => void
  myLastOpponent: TOpponentUserData | null
}) => {
  const [
    isForcedExitBattleAnimationFinished,
    setIsForcedExitBattleAnimationFinished,
  ] = useState(false)

  const { battleGameRewardRadioValue } = useContext(AppContext)
  const [isStartFindingOpponent, setIsStartFindingOpponent] = useState(true) // true
  const [isVersusAnimationStart, setIsVersusAnimationStart] = useState(false) // false
  const [isClosingAnimation, setIsClosingAnimation] = useState(false) // false
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false) // false
  const [isMorphAnimation, setIsMorphAnimation] = useState(false) // false
  const [isCardBgAnimationStart, setIsCardBgAnimationStart] = useState(false) // false
  const [isStartCountdown, setIsStartCountdown] = useState(false) // false
  const [isCountdownCompleted, setIsCountdownCompleted] = useState(false) // false
  const [isForcedExit, _] = useState(false)

  const [areaClaimedPercentage, setAreaClaimedPercentage] = useState(0)

  const [isBoostActive0, setIsBoostActive0] = useState(false)
  const [isBoostActive1, setIsBoostActive1] = useState(false)

  const [countdownTarget, setCountdownTarget] = useState<number | null>(null)

  const router = useRouter()

  const timeouts = useRef<Array<number>>([])
  const forcedExitTimeoutRef = useRef<number | null>(null)

  const addTimeout = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timeouts.current.push(id)
  }

  useEffect(() => {
    if (forcedExitTimeoutRef.current) {
      clearTimeout(forcedExitTimeoutRef.current)
      forcedExitTimeoutRef.current = null
    }

    if (!opponentInfo) {
      forcedExitTimeoutRef.current = window.setTimeout(() => {
        onForcedExitBattle?.()
      }, 30000)
      return
    }

    timeouts.current.forEach(clearTimeout)
    timeouts.current = []

    const animationTimeouts = [
      { fn: () => setIsVersusAnimationStart(true), delay: 1000 },
      { fn: () => setIsStartFindingOpponent(false), delay: 5000 },
      { fn: () => setIsClosingAnimation(true), delay: 5500 },
      { fn: () => setIsOpeningAnimation(true), delay: 9000 },
      { fn: () => setIsMorphAnimation(true), delay: 10500 },
      { fn: () => setIsCardBgAnimationStart(true), delay: 10500 },
      { fn: () => setIsStartCountdown(true), delay: 15000 },
    ]

    animationTimeouts.forEach(({ fn, delay }) => {
      addTimeout(fn, delay)
    })

    return () => {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
    }
  }, [opponentInfo, onForcedExitBattle])

  useEffect(() => {
    if (isBoostActive0 || isBoostActive1) {
      const boostTimeoutId = window.setTimeout(() => {
        setIsBoostActive0(false)
        setIsBoostActive1(false)
      }, 8000)

      return () => {
        clearTimeout(boostTimeoutId)
      }
    }
  }, [isBoostActive0, isBoostActive1])

  useEffect(() => {
    if (!isCountdownCompleted) return
    onCountdownCompleted?.()
  }, [isCountdownCompleted])

  useEffect(() => {
    if (!myInfo || !opponentInfo) return
    setAreaClaimedPercentage(myInfo.clicks - opponentInfo.clicks)
  }, [myInfo, opponentInfo])

  useEffect(() => {
    onAreaClaimedPercentageChange?.(areaClaimedPercentage)
  }, [areaClaimedPercentage])

  useEffect(() => {
    if (!isForcedExit) return

    setIsForcedExitBattleAnimationFinished(true)
    const timeoutId = setTimeout(() => {
      onForcedExitBattle?.()
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isForcedExit, onForcedExitBattle])

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
                <span className="mr-1 text-lg">1</span>
                <span className="text-xs">
                  {myInfo?.bet && betConverter[myInfo.bet]}
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
                    date={Number(countdownTarget)}
                    intervalDelay={1000}
                    precision={0}
                    onComplete={() => {
                      onGameFinished?.()
                      router.navigate({
                        to: '/minigames/battle-result',
                        search: {
                          myNickname: myInfo?.nickname ?? 'Unknown',
                          opponentNickname:
                            myLastOpponent?.nickname ?? 'Unknown',
                          isMeWinner: areaClaimedPercentage > 1,
                          bet: battleGameRewardRadioValue,
                          photoUrl: myInfo?.photoUrl ?? '',
                          opponentPhotoUrl: myLastOpponent?.photoUrl ?? '',
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
            nickname={opponentInfo?.nickname}
            photoUrl={opponentInfo?.photoUrl}
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
                setCountdownTarget(Date.now() + 60000)
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
            nickname={myInfo?.nickname}
            photoUrl={myInfo?.photoUrl}
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
                onBattleClick?.(isBoostActive0 || isBoostActive1)
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
            onClick={() => {
              onForcedExitBattle?.()
              if (forcedExitTimeoutRef.current) {
                clearTimeout(forcedExitTimeoutRef.current)
                forcedExitTimeoutRef.current = null
              }
            }}
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
    </>
  )
}
