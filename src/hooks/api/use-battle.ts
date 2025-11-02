import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useMatches, useRouter } from '@tanstack/react-router'
import { useAccount } from './use-account'
import type { TOpponentUserData } from '@/components/battle-page/battle-intro-scene'

const baseUrl = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:100'
const socket = io(`${baseUrl}/battle`, {
  autoConnect: false, // Рекомендуется для лучшего контроля
})

interface IGameFinishedData {
  roomId: string
  winner: TOpponentUserData
  loser: TOpponentUserData
}

// WebSocket hook with TanStack Query integration
export function useBattle() {
  const { user: account } = useAccount()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [opponentInfo, setOpponentInfo] = useState<TOpponentUserData | null>(
    null,
  )

  const [myLastOpponent, setMyLastOpponent] =
    useState<TOpponentUserData | null>(null)

  const [myInfo, setMyInfo] = useState<TOpponentUserData>({
    userId: Number(account?.id),
    photoUrl: String(account?.photo_url),
    nickname: String(account?.username),
    bet: 0,
    clicks: 0,
  })

  const [isMeViewMyOpponent, setIsMeViewMyOpponent] = useState(false)

  const [isMeViewMyOpponent0, setIsMeViewMyOpponent0] = useState(false)

  const [isMeViewMyOpponent1, setIsMeViewMyOpponent1] = useState(false)

  const router = useRouter()
  const pathnames = useMatches()

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    socket.on('connect', () => {
      console.log(`Connected with id: ${socket.id}`)
    })

    socket.on('waiting_for_players', (data) => {
      setRoomId(data.roomId)
    })

    socket.on('game_started', (data) => {
      const opponent = data.users.filter(
        (user: TOpponentUserData) => user.userId !== account?.id,
      )[0]
      const me = data.users.filter(
        (user: TOpponentUserData) => user.userId === account?.id,
      )[0]
      if (opponent !== undefined || opponent !== null) {
        setOpponentInfo((prevInfo) => (prevInfo ? prevInfo : opponent))
        setMyLastOpponent(opponent)
      }
      if (me !== undefined || me !== null) {
        setMyInfo(me)
      }
      setRoomId(data.roomId)
    })

    socket.on('me_view_my_opponent', (data) => {
      if (data.userId === account?.id) {
        setIsMeViewMyOpponent0(true)
      } else {
        setIsMeViewMyOpponent1(true)
      }
    })

    socket.on('click_update', (data) => {
      const opponent = data.users.filter(
        (user: TOpponentUserData) => user.userId !== account?.id,
      )[0]

      const me = data.users.filter(
        (user: TOpponentUserData) => user.userId === account?.id,
      )[0]
      if (opponent !== undefined || opponent !== null) {
        setOpponentInfo(opponent)
      }
      if (me !== undefined || me !== null) {
        setMyInfo(me)
      }
    })

    socket.on('game_finished', (data: IGameFinishedData) => {
      const isWinner = data.winner.userId === account?.id

      const me = isWinner ? data.winner : data.loser

      const opponent = isWinner ? data.loser : data.winner

      const betConverter: any = {
        '86400': '1 day',
        '604800': '1 week',
        '2592000': '1 month',
        '31536000': '1 year',
      }

      setMyInfo({
        userId: Number(account?.id),
        photoUrl: String(account?.photo_url),
        nickname: String(account?.username),
        bet: 0,
        clicks: 0,
      })
      setMyLastOpponent(opponent)
      setOpponentInfo(null)
      setRoomId(null)

      router.navigate({
        to: '/minigames/battle-result',
        search: {
          myNickname: me.nickname,
          opponentNickname: opponent.nickname,
          isMeWinner: isWinner,
          bet: betConverter[String(data.winner.bet)],
          photoUrl: me.photoUrl,
          opponentPhotoUrl: opponent.photoUrl,
        },
      })
    })

    socket.on('error', () => {
      console.log('socket error')
    })

    socket.on('disconnect', () => {
      console.log('disconnect')
    })

    return () => {
      socket.off('connect')
      socket.off('waiting_for_players')
      socket.off('game_started')
      socket.off('me_view_my_opponent')
      socket.off('click_update')
      socket.off('game_finished')
      socket.off('error')
      socket.off('disconnect')
    }
  }, [])

  useEffect(() => {
    if (pathnames[1].pathname !== '/minigames/battle') {
      forceDisconnect()
    }
  }, [pathnames])

  useEffect(() => {
    if (isMeViewMyOpponent0 && isMeViewMyOpponent1) {
      setIsMeViewMyOpponent(true)
    }
  }, [isMeViewMyOpponent0, isMeViewMyOpponent1])

  const makeBet = useCallback(
    (bet: number, isPrivate?: boolean) => {
      socket.emit('join_or_create_room', {
        bet,
        userId: Number(account?.id),
        photoUrl: account?.photo_url,
        nickname: account?.username,
        isPrivate: isPrivate, 
      })
    },
    [account],
  )

  const leaveGame = useCallback((roomId_: string) => {
    socket.emit('leave_room', {
      roomId: roomId_,
    })
    setMyInfo({
      userId: Number(account?.id),
      photoUrl: String(account?.photo_url),
      nickname: String(account?.username),
      bet: 0,
      clicks: 0,
    })
    setOpponentInfo(null)
    setRoomId(null)
  }, [])

  const click = useCallback(
    (roomId_: string) => {
      socket.emit('click', {
        roomId: roomId_,
        userId: account?.id,
      })
    },
    [account],
  )

  const clickX2 = useCallback(
    (roomId_: string) => {
      socket.emit('click_x2', {
        roomId: roomId_,
        userId: account?.id,
      })
    },
    [account],
  )

  const isMeViewMyOpponentEmit = useCallback(
    (roomId_: string) => {
      socket.emit('is_me_view_my_opponent', {
        roomId: roomId_,
        userId: account?.id,
      })
    },
    [account],
  )

  const isMeReady = useCallback(
    (roomId_: string) => {
      socket.emit('is_me_ready', {
        roomId: roomId_,
        userId: account?.id,
      })
    },
    [account],
  )

  const forceDisconnect = useCallback(() => {
    socket.emit('force_disconnect')
    socket.disconnect()
  }, [])

  const isFinishedGame = useCallback((roomId_: string) => {
    socket.emit('finish_game', {
      roomId: roomId_,
    })
  }, [])

  return {
    makeBet,
    leaveGame,
    click,
    opponentInfo,
    clickX2,
    myInfo,
    roomId,
    isMeReady,
    isMeViewMyOpponent,
    myLastOpponent,
    isMeViewMyOpponentEmit,
    isFinishedGame,
    forceDisconnect,
    isSocketConnected: socket.connected,
  }
}
