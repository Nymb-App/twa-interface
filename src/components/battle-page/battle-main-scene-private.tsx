import { AppContext } from '@/context/app-context'
import type { IRoom, IUser } from '@/hooks/api/use-battle'
import { useBattle } from '@/hooks/api/use-battle'
import { cn } from '@/utils'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Countdown from 'react-countdown'
import useSound from 'use-sound'
import { CountdownStartGame } from '../minigames/countdown-start-game'
import { ActionButton } from '../ui/action-button'
import { BattleCard } from './battle-card'
import { BattleGameControlsPanel } from './battle-game-controls-panel'
import { BattleTitle } from './battle-preview-screen'
import { BattleScene } from './battle-scene'
import { BattleAnimatedMiddleLine } from './ui/battle-animated-middle-line'

const betConverter: Record<string, string> = {
  '86400': 'days',
  '604800': 'weeks',
  '2592000': 'months',
  '31536000': 'years',
}

export const BattleMainScenePrivate = ({
  areaClaimedPercent = 0,
  onAreaClaimedPercentageChange,
  onForcedExitBattle,
  opponentInfo,
  myInfo,
  roomData,
  onBattleClick,
  onCountdownCompleted,
  onJoinGame,
  onGameFinished,
}: {
  areaClaimedPercent?: number
  onAreaClaimedPercentageChange?: (percent: number) => void
  onForcedExitBattle?: () => void
  opponentInfo?: IUser | null
  myInfo: IUser | null
  roomData: IRoom | null
  onBattleClick?: (isX2Active: boolean) => void
  onJoinGame?: (bet: number, isPrivate?: boolean) => void
  onCountdownCompleted?: () => void
  onGameFinished?: () => void
}) => {
  const [
    isForcedExitBattleAnimationFinished,
    setIsForcedExitBattleAnimationFinished,
  ] = useState(false)

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

  const [isToBattleReady, setIsToBattleReady] = useState(false)

  const [play] = useSound('/sounds/Button.aac')

  const [playBattleClinStart, { stop: stopBattleClinStart }] = useSound(
    '/sounds/Battle-Clin-Start.aac',
  )

  const [playBattleClinEnd, { stop: stopBattleClinEnd }] = useSound(
    '/sounds/Battle-Clin-End.aac',
  )

  const { setIsBattleGameBackgroundMusicActive } = useContext(AppContext)

  const timeouts = useRef<Array<number>>([])
  const forcedExitTimeoutRef = useRef<number | null>(null)

  const addTimeout = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timeouts.current.push(id)
  }

  const waitingStartDate = useMemo(() => {
    return Date.now() + 60_000
  }, [])

  const { forceDisconnect } = useBattle()

  useEffect(() => {
    if (forcedExitTimeoutRef.current) {
      clearTimeout(forcedExitTimeoutRef.current)
      forcedExitTimeoutRef.current = null
    }

    if (opponentInfo?.id === myInfo?.id) {
      onForcedExitBattle?.()
      return
    }

    if (roomData && roomData.users.length < roomData.maxUsersCount) {
      return
    }

    timeouts.current.forEach(clearTimeout)
    timeouts.current = []

    const animationTimeouts = [
      { fn: () => setIsVersusAnimationStart(true), delay: 500 },
      { fn: () => setIsStartFindingOpponent(false), delay: 2500 },
      {
        fn: () => {
          playBattleClinStart()
          setIsClosingAnimation(true)
        },
        delay: 2750,
      },
      {
        fn: () => {
          playBattleClinEnd()
          setIsOpeningAnimation(true)
        },
        delay: 4500,
      },
      { fn: () => setIsMorphAnimation(true), delay: 5250 },
      { fn: () => setIsCardBgAnimationStart(true), delay: 5250 },
      { fn: () => setIsStartCountdown(true), delay: 7500 },
    ]

    if (!opponentInfo?.clicks || opponentInfo.clicks < 1) {
      animationTimeouts.forEach(({ fn, delay }) => {
        addTimeout(fn, delay)
      })
    }

    return () => {
      stopBattleClinStart()
      stopBattleClinEnd()
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
    }
  }, [opponentInfo, onForcedExitBattle, roomData, myInfo])
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
    const myClicks = Number(myInfo.clicks)
    const oppClicks = Number(opponentInfo.clicks)
    setAreaClaimedPercentage(myClicks - oppClicks)
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

  // if (!opponentInfo && roomData?.createdBy !== myInfo?.id)
  //   return <FallbackLoader />

  const isFindingOpponent = useMemo(() => {
    if (isToBattleReady) return false
    if (myInfo?.id !== roomData?.createdBy) return false
    if (roomData && roomData.users.length < roomData.maxUsersCount) return true
    return isStartFindingOpponent
  }, [roomData, isStartFindingOpponent, isToBattleReady])

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
                  {roomData && betConverter[roomData.bet]}
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
            isFindingUser={isFindingOpponent}
            nickname={opponentInfo?.nickname}
            photoUrl={opponentInfo?.photoUrl}
            isMe={false}
            areaClaimedPercent={areaClaimedPercent}
            isRow={isMorphAnimation}
            isBgVisible={!isCardBgAnimationStart}
            className={cn(
              'transition-all duration-2500 animate-battle-finding-slide-top-fade',
              isClosingAnimation &&
                !isOpeningAnimation &&
                'flex-1 min-h-[220px]',
              isOpeningAnimation && 'h-[54px]',
            )}
            classNameBg={cn(
              'transition-all duration-1500 delay-750',
              isOpeningAnimation && 'opacity-0',
            )}
          />
          {isStartCountdown && !isCountdownCompleted && (
            <CountdownStartGame
              onComplete={() => {
                setIsBattleGameBackgroundMusicActive(true)
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
              'absolute top-1/2 left-1/2 -translate-1/2 z-1 w-[calc(100%-50px)] opacity-0 transition-all duration-300',
              isVersusAnimationStart && 'opacity-100',
              isOpeningAnimation && 'opacity-0 delay-750',
            )}
            classNameForLine={cn(
              'opacity-0 w-0 transition-all',
              isClosingAnimation && 'w-full opacity-100 delay-750 duration-750',
              isOpeningAnimation && 'w-0 opacity-0 delay-300 duration-750',
            )}
          />
          <BattleCard
            nickname={myInfo?.nickname}
            photoUrl={myInfo?.photoUrl}
            isRow={isMorphAnimation}
            isBgVisible={!isCardBgAnimationStart}
            areaClaimedPercent={areaClaimedPercent}
            className={cn(
              'transition-all duration-2500 w-full h-[220px] animate-battle-finding-slide-bottom-fade',
              isClosingAnimation &&
                !isOpeningAnimation &&
                'flex-1 min-h-[220px]',
              isOpeningAnimation && 'h-[54px]',
            )}
            classNameBg={cn(
              'transition-all duration-750 delay-750',
              isOpeningAnimation && 'opacity-0',
            )}
          />
        </div>
        <div
          className={cn(
            'transition-all duration-2000 delay-650 h-0',
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
          'transition-all duration-2000 delay-650 px-4 h-[56px] inline-flex gap-2',
          isOpeningAnimation && 'h-0',
        )}
      >
        {isStartFindingOpponent && !isToBattleReady && (
          <div className="w-full h-full relative">
            {roomData?.createdBy !== myInfo?.id && (
              <Countdown
                key={'to-private-battle-accept'}
                date={waitingStartDate}
                intervalDelay={1000}
                precision={0}
                onComplete={() => {
                  onForcedExitBattle?.()
                  if (forcedExitTimeoutRef.current) {
                    clearTimeout(forcedExitTimeoutRef.current)
                    forcedExitTimeoutRef.current = null
                  }
                }}
                renderer={({ seconds }) => (
                  <span className="absolute top-[-25px] left-1/2 -translate-x-1/2 text-sm text-white/40 text-center">
                    Waiting time:
                    <span className="text-white/60"> {seconds} </span>
                    seconds
                  </span>
                )}
              />
            )}
            <div className={cn('inline-flex gap-2 w-full h-full')}>
              <ActionButton
                disabled={
                  !isForcedExitBattleAnimationFinished ||
                  !isStartFindingOpponent
                }
                onClick={() => {
                  play()
                  forceDisconnect(roomData?.createdBy)
                  onForcedExitBattle?.()
                  if (forcedExitTimeoutRef.current) {
                    clearTimeout(forcedExitTimeoutRef.current)
                    forcedExitTimeoutRef.current = null
                  }
                }}
                className={cn(
                  'h-full bg-gradient-to-b from-[#FFFFFF] to-[#999999] opacity-0 animate-fade-in',
                )}
                onAnimationEnd={() =>
                  setIsForcedExitBattleAnimationFinished(true)
                }
              >
                <span className="font-pixel text-[#121312] font-[400] uppercase text-[18px] leading-[24px]">
                  CLOSE
                </span>
              </ActionButton>
              {/* This is only shown for invited user */}
              {roomData && roomData.createdBy !== Number(myInfo?.id) && (
                <ActionButton
                  disabled={
                    !isForcedExitBattleAnimationFinished ||
                    !isStartFindingOpponent
                  }
                  onClick={() => {
                    play()
                    onJoinGame?.(Number(roomData.bet), true)
                    setIsToBattleReady(true)
                  }}
                  className={cn(
                    'h-full bg-gradient-to-b from-[#8C35FB] to-[#6602E7] opacity-0 animate-fade-in',
                  )}
                  onAnimationEnd={() =>
                    setIsForcedExitBattleAnimationFinished(true)
                  }
                >
                  <span className="font-pixel text-white font-[400] uppercase text-[18px] leading-[24px]">
                    TO BATTLE
                  </span>
                </ActionButton>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
