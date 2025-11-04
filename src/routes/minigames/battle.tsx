import { BattleIntroScene } from '@/components/battle-page/battle-intro-scene'
import { BattleMainScene } from '@/components/battle-page/battle-main-scene'
import { PageLayout } from '@/components/ui/page-layout'
import { useAccount } from '@/hooks/api/use-account'
import { useBattle } from '@/hooks/api/use-battle'
import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/minigames/battle')({
  component: RouteComponent,
  validateSearch: (search) => ({
    bet: search.bet,
    invitedBy: search.invitedBy,
  }),
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
    roomData,
    click,
    isMeReady,
    leaveGame,
    isFinishedGame,
    myLastOpponent,
  } = useBattle()

  const { user } = useAccount()

  const resetGame = () => {
    setIsStartFindingOpponent(false)
    setIsStartFindingOpponentAnimationEnd(false)
    setIsWinningResult(false)
    setIsReset(true)
    if (roomId) leaveGame()
  }

  // const handleJoinGame = (
  //   bet: number,
  //   isPrivate?: boolean,
  //   invitedBy?: number,
  // ) => {
  //   makeBet({
  //     user: {
  //       id: Number(user?.id),
  //       photoUrl: String(user?.photo_url),
  //       nickname: String(user?.username),
  //     },
  //     bet,
  //     isPrivate,
  //     invitedBy,
  //   })
  // }

  const search = useSearch({ from: '/minigames/battle' })
  useEffect(() => {
    if (search.invitedBy !== undefined && search.bet !== undefined) {
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
      setIsStartFindingOpponent(true)
      setIsStartFindingOpponentAnimationEnd(true)
      setIsReset(false)
    }
  }, [search.invitedBy, search.bet, user?.id])

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
      if (roomId) isFinishedGame()
      setIsWinningResult(true)
      const betConverter: Record<string, string> = {
        '86400': '1 day',
        '604800': '1 week',
        '2592000': '1 month',
        '31536000': '1 year',
      }
      router.navigate({
        to: '/minigames/battle-result',
        search: {
          myNickname: myInfo.nickname as string,
          opponentNickname: opponentInfo?.nickname ?? 'Unknown',
          isMeWinner: isWinner,
          bet: betConverter[search.bet as string],
          photoUrl: myInfo.photoUrl as string,
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
        <BattleMainScene
          key={roomId}
          isPrivateBattle={myInfo.invitedBy !== undefined}
          opponentInfo={opponentInfo}
          myLastOpponent={myLastOpponent}
          myInfo={myInfo}
          roomData={roomData}
          areaClaimedPercent={areaClaimedPercent}
          onForcedExitBattle={resetGame}
          onAreaClaimedPercentageChange={(percent) =>
            setAreaClaimedPercent(percent)
          }
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
    </PageLayout>
  )
}
