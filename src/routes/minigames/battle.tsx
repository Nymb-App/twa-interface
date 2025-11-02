import { BattleIntroScene } from '@/components/battle-page/battle-intro-scene'
import { BattleMainScene } from '@/components/battle-page/battle-main-scene'
import { PageLayout } from '@/components/ui/page-layout'
import { useBattle } from '@/hooks/api/use-battle'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/minigames/battle')({
  component: RouteComponent,
})

function RouteComponent() {
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
    click,
    isMeReady,
    clickX2,
    leaveGame,
    isFinishedGame,
    myLastOpponent,
  } = useBattle()

  const resetGame = () => {
    setIsStartFindingOpponent(false)
    setIsStartFindingOpponentAnimationEnd(false)
    setIsWinningResult(false)
    setIsReset(true)
    if (roomId) leaveGame(roomId)
  }

  const handleJoinGame = (bet: number) => {
    makeBet(bet)
  }

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
      const isWinner = areaClaimedPercent >= 80
      if (roomId) isFinishedGame(roomId)
      setIsWinningResult(true)
      const betConverter: any = {
        '86400': '1 day',
        '604800': '1 week',
        '2592000': '1 month',
        '31536000': '1 year',
      }
      router.navigate({
        to: '/minigames/battle-result',
        search: {
          myNickname: myInfo.nickname,
          opponentNickname: opponentInfo?.nickname ?? 'Unknown',
          isMeWinner: isWinner,
          bet: betConverter[myInfo.bet],
          photoUrl: myInfo.photoUrl,
          opponentPhotoUrl: opponentInfo?.photoUrl ?? 'Unknown',
        },
      })
    }
  }, [areaClaimedPercent, myInfo, opponentInfo, router])

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
          onJoinGame={handleJoinGame}
          onAnimationEnd={(params) => {
            if (params.animationName === 'battle-intro-section-slide-fade')
              setIsAnimationsEnd(true)
          }}
        />
      )}
      {isStartFindingOpponent && (
        <BattleMainScene
          key={roomId}
          opponentInfo={opponentInfo}
          myLastOpponent={myLastOpponent}
          myInfo={myInfo}
          areaClaimedPercent={areaClaimedPercent}
          onForcedExitBattle={resetGame}
          onAreaClaimedPercentageChange={(percent) =>
            setAreaClaimedPercent(percent)
          }
          onCountdownCompleted={() => {
            if (roomId) {
              const timer = setTimeout(() => {
                isMeReady(roomId)
              }, 1000)
              return () => clearTimeout(timer)
            }
          }}
          onGameFinished={() => {
            if (roomId) {
              isFinishedGame(roomId)
            }
          }}
          onBattleClick={(isX2Active: boolean) => {
            if (roomId) {
              if (isX2Active) {
                clickX2(roomId)
              } else {
                click(roomId)
              }
            }
          }}
        />
      )}
    </PageLayout>
  )
}
