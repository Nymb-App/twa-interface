import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
// import type { IJoinGameData } from '@/components/battle-page/battle-intro-scene'
import { PageLayout } from '@/components/ui/page-layout'
import { AppContext } from '@/context/app-context'
import { BattleIntroScene } from '@/components/battle-page/battle-intro-scene'
import { BattleMainScene } from '@/components/battle-page/battle-main-scene'
import { useAccount } from '@/hooks/api/use-account'

export const Route = createFileRoute('/minigames/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  const [, setIsAnimationsEnd] = useState(false)

  useEffect(() => {
    const originalColor = document.body.style.backgroundColor
    return () => {
      document.body.style.backgroundColor = originalColor
    }
  }, [])
  const [, setIsClosingAnimation] = useState(false)
  const [isOpeningAnimation] = useState(false)
  const [, setIsOpeningAnimationDelayed] = useState(false)
  const [, setIsReset] = useState(true)

  const { battleGameRewardRadioValue } = useContext(AppContext)
  const [isStartFindingOpponent, setIsStartFindingOpponent] = useState(false)
  const [
    isStartFindingOpponentAnimationEnd,
    setIsStartFindingOpponentAnimationEnd,
  ] = useState(false)
  const [isWinningResult, setIsWinningResult] = useState(false)

  const [areaClaimedPercent, setAreaClaimedPercent] = useState(0)
  const router = useRouter()

  const opponentNickname = 'igorivanov'
  const myNickname = 'tevial'

  const resetGame = () => {
    setIsStartFindingOpponent(false)
    setIsStartFindingOpponentAnimationEnd(false)
    setIsWinningResult(false)

    setIsReset(true)
  }

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

      setIsWinningResult(true)
      router.navigate({
        to: '/minigames/battle-result',
        search: {
          myNickname: myNickname,
          opponentNickname: opponentNickname,
          isMeWinner: isWinner,
          bet: battleGameRewardRadioValue,
        },
      })
    }
  }, [
    areaClaimedPercent,
    battleGameRewardRadioValue,
    myNickname,
    opponentNickname,
    router,
  ])

  const socket = io(`${import.meta.env.VITE_PUBLIC_API_URL}/battle`)

  // const [webSocketData, setWebSocketData] = useState<IJoinGameData | null>(null)

  const [roomId, setRoomId] = useState<string | undefined>(undefined)
  // const [isConnected, setIsConnected] = useState(socket.connected)

  const { user } = useAccount()

  useEffect(() => {
    // Слушаем событие 'connect'
    socket.on('connect', () => {
      // setIsConnected(true)
      console.log(`Connected with id: ${socket.id}`)
    })

    // Слушаем событие 'joinedRoom'
    socket.on('joinedRoom', (data) => {
      console.log(`Joined room`, data)

      if ('roomId' in data) {
        console.log(`Joined room: ${data.roomId}`)
        setRoomId(data.roomId)
      }
    })

    // Слушаем событие 'disconnect'
    socket.on('disconnect', () => {
      console.log('disconnect')
      // setIsConnected(false)
    })

    // Очистка при размонтировании компонента
    return () => {
      socket.off('connect')
      socket.off('joinedRoom')
      socket.off('disconnect')
    }
  }, [])

  const handleJoinGame = (bet: number) => {
    const myUserInfo = {
      userId: user?.id,
      photoUrl: user?.photo_url,
      nickname: user?.username,
      bet: bet,
    }
    socket.emit('joinRoom', myUserInfo)

    console.log(myUserInfo, 'info?')
  }

  return (
    <PageLayout
      useFooter={false}
      className="flex flex-col justify-between bg-transparent pb-0 overflow-hidden"
      classNameContent="flex flex-col justify-between flex-1"
    >
      {/* <button onClick={handleJoinGame}>Join room</button> */}
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
          roomId={roomId}
          areaClaimedPercent={areaClaimedPercent}
          onForcedExitBattle={resetGame}
          onAreaClaimedPercentageChange={(percent) =>
            setAreaClaimedPercent(percent)
          }
          socket={socket}
        />
      )}
    </PageLayout>
  )
}
