import { BattleIntroScene } from '@/components/battle-page/battle-intro-scene'
import { BattleMainScene } from '@/components/battle-page/battle-main-scene'
import { BattleMainScenePrivate } from '@/components/battle-page/battle-main-scene-private'
import { PageLayout } from '@/components/ui/page-layout'
import { useAccount, useAccountMe } from '@/hooks/api/use-account'
import { useBattle } from '@/hooks/api/use-battle'
import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/minigames/battle')({
  component: RouteComponent,
  validateSearch: (search) => ({
    bet: search.bet,
    invitedBy: search.invitedBy,
  }),
})

function RouteComponent() {
  const search = useSearch({ from: '/minigames/battle' })
  const [, setIsAnimationsEnd] = useState(false)

  const [, setIsClosingAnimation] = useState(false)
  const [isOpeningAnimation] = useState(false)
  const [, setIsOpeningAnimationDelayed] = useState(false)
  const [, setIsReset] = useState(true)

  const [isStartFindingOpponent, setIsStartFindingOpponent] = useState(false)
  const [
    isStartFindingOpponentAnimationEnd,
    setIsStartFindingOpponentAnimationEnd,
  ] = useState(false)
  const [isWinningResult, setIsWinningResult] = useState(false)

  const [areaClaimedPercent, setAreaClaimedPercent] = useState(0)
  const router = useRouter()

  const {
    makeBet,
    opponentInfo,
    myInfo,
    roomId,
    roomData,
    resultData,
    getRoomData,
    click,
    isMeReady,
    leaveGame,
    forceDisconnect,
    isFinishedGame,
  } = useBattle()

  const { user } = useAccount()

  const resetGame = () => {
    setIsStartFindingOpponent(false)
    setIsStartFindingOpponentAnimationEnd(false)
    setIsWinningResult(false)
    setIsReset(true)
    if (roomId) leaveGame()
  }

  const { accountQuery } = useAccountMe()

  useEffect(() => {
    if (search.invitedBy === undefined || search.bet === undefined) return

    const time = accountQuery.data?.time
    if (time && time < Math.floor(Date.now() / 1000) + Number(search.bet)) {
      resetGame()
      forceDisconnect(Number(search.invitedBy))
      toast.error('Not enough time for bet')
      return
    }

    getRoomData(Number(search.invitedBy))
    setIsStartFindingOpponent(true)
    setIsStartFindingOpponentAnimationEnd(true)
    setIsReset(false)
  }, [search.invitedBy, search.bet, accountQuery.data])

  useEffect(() => {
    const originalColor = document.body.style.backgroundColor
    return () => {
      document.body.style.backgroundColor = originalColor
    }
  }, [])

  useEffect(() => {
    if (!isStartFindingOpponent) return

    const timeoutId = window.setTimeout(() => {
      setIsClosingAnimation(true)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [isStartFindingOpponent])

  useEffect(() => {
    if (!isOpeningAnimation) return

    const timeoutId = window.setTimeout(() => {
      setIsOpeningAnimationDelayed(true)
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [isOpeningAnimation])

  useEffect(() => {
    if (areaClaimedPercent > 0) {
      document.body.style.backgroundColor = '#0a1309'
    } else if (areaClaimedPercent < 0) {
      document.body.style.backgroundColor = '#110522'
    } else {
      document.body.style.backgroundColor = '#03061a'
    }
  }, [areaClaimedPercent])

  useEffect(() => {
    if (areaClaimedPercent >= 80 || areaClaimedPercent <= -80) {
      if (roomId) isFinishedGame()
      setIsWinningResult(true)
    }
  }, [areaClaimedPercent, myInfo, opponentInfo, resultData, router])
  return (
    <PageLayout
      useFooter={false}
      className="flex flex-col justify-between bg-transparent pb-0 overflow-hidden"
      classNameContent="flex flex-col justify-between flex-1"
    >
      {!isWinningResult && !isStartFindingOpponentAnimationEnd && (
        <BattleIntroScene
          className="flex-1"
          onFindingOpponent={() => {
            setIsStartFindingOpponent(true)
            setIsStartFindingOpponentAnimationEnd(true)
            setIsReset(false)
          }}
          onJoinGame={(bet: number, isPrivate?: boolean) => {
            makeBet({
              user: {
                id: Number(user?.id),
                photoUrl: String(user?.photo_url),
                nickname: String(user?.username),
              },
              isPrivate,
              bet,
            })
          }}
          onAnimationEnd={(params) => {
            if (params.animationName === 'battle-intro-section-slide-fade')
              setIsAnimationsEnd(true)
          }}
        />
      )}
      {isStartFindingOpponent && (
        <>
          {roomData?.isPrivate ? (
            <BattleMainScenePrivate
              key={roomId}
              opponentInfo={
                opponentInfo === null
                  ? roomData.users.find(
                      (userInfo) => userInfo.id !== myInfo?.id,
                    )
                  : opponentInfo
              }
              myInfo={myInfo}
              roomData={roomData}
              areaClaimedPercent={areaClaimedPercent}
              onForcedExitBattle={resetGame}
              onAreaClaimedPercentageChange={(percent) =>
                setAreaClaimedPercent(percent)
              }
              onJoinGame={() => {
                makeBet({
                  user: {
                    id: Number(user?.id),
                    photoUrl: String(user?.photo_url),
                    nickname: String(user?.username),
                  },
                  bet: Number(search.bet),
                  isPrivate: true,
                  invitedBy: Number(search.invitedBy),
                })
              }}
              onCountdownCompleted={() => {
                const timer = setTimeout(() => {
                  isMeReady()
                }, 1000)
                return () => clearTimeout(timer)
              }}
              onGameFinished={() => {
                if (roomId) {
                  isFinishedGame()
                }
              }}
              onBattleClick={(isX2Active: boolean) => {
                if (roomId) {
                  if (isX2Active) {
                    click(true)
                  } else {
                    click(false)
                  }
                }
              }}
            />
          ) : (
            <BattleMainScene
              key={roomId}
              opponentInfo={opponentInfo}
              myInfo={myInfo}
              roomData={roomData}
              areaClaimedPercent={areaClaimedPercent}
              onForcedExitBattle={resetGame}
              onAreaClaimedPercentageChange={(percent) =>
                setAreaClaimedPercent(percent)
              }
              onJoinGame={() => {
                makeBet({
                  user: {
                    id: Number(user?.id),
                    photoUrl: String(user?.photo_url),
                    nickname: String(user?.username),
                  },
                  bet: Number(search.bet),
                  isPrivate: true,
                  invitedBy: Number(search.invitedBy),
                })
              }}
              onCountdownCompleted={() => {
                const timer = setTimeout(() => {
                  isMeReady()
                }, 1000)
                return () => clearTimeout(timer)
              }}
              onGameFinished={() => {
                if (roomId) {
                  isFinishedGame()
                }
              }}
              onBattleClick={(isX2Active: boolean) => {
                if (roomId) {
                  if (isX2Active) {
                    click(true)
                  } else {
                    click(false)
                  }
                }
              }}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}
