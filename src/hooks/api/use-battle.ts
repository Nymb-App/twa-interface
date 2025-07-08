import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAccount } from './use-account'
import type { TOpponentUserData } from '@/components/battle-page/battle-intro-scene'

const baseUrl = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:100'
const socket = io(`${baseUrl}/battle`, {
  autoConnect: false, // Рекомендуется для лучшего контроля
})

// WebSocket hook with TanStack Query integration
export function useBattle() {
  const { user: account } = useAccount()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [opponentInfo, setOpponentInfo] = useState<TOpponentUserData | null>(
    null,
  )
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

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    socket.on('connect', () => {
      console.log(`Connected with id: ${socket.id}`)
    })

    socket.on('waiting_for_players', (data) => {
      console.log(`Waiting for players`, data)
      setRoomId(data.roomId)
    })

    socket.on('game_started', (data) => {
      console.log(`Game started`, data)
      const opponent = data.users.filter(
        (user: TOpponentUserData) => user.userId !== account?.id,
      )[0]
      const me = data.users.filter(
        (user: TOpponentUserData) => user.userId === account?.id,
      )[0]
      if (opponent !== undefined || opponent !== null) {
        setOpponentInfo((prevInfo) => (prevInfo ? prevInfo : opponent))
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
      console.log(`Me view my opponent`, data)
    })

    socket.on('click_update', (data) => {
      console.log(`Click`, data)
      const opponent = data.users.filter(
        (user: TOpponentUserData) => user.userId !== account?.id,
      )[0]
      console.log('opponent', opponent)

      const me = data.users.filter(
        (user: TOpponentUserData) => user.userId === account?.id,
      )[0]
      console.log('me', me)
      if (opponent !== undefined || opponent !== null) {
        setOpponentInfo(opponent)
      }
      if (me !== undefined || me !== null) {
        setMyInfo(me)
      }
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
      socket.off('error')
      socket.off('disconnect')
    }
  }, [])

  useEffect(() => {
    if (isMeViewMyOpponent0 && isMeViewMyOpponent1) {
      setIsMeViewMyOpponent(true)
    }
  }, [isMeViewMyOpponent0, isMeViewMyOpponent1])

  console.log('OpponentInfo', opponentInfo)

  const makeBet = useCallback(
    (bet: number) => {
      socket.emit('join_or_create_room', {
        bet,
        userId: Number(account?.id),
        photoUrl: account?.photo_url,
        nickname: account?.username,
      })
    },
    [account],
  )

  const leaveGame = useCallback((roomId_: string) => {
    socket.emit('leave_room', {
      roomId: roomId_,
    })
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
    isMeViewMyOpponentEmit,
  }
}
