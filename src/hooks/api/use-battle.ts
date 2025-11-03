import type { TOpponentUserData } from '@/components/battle-page/battle-intro-scene'
import { useWebSocket } from '@/provider/web-socket-provider'
import { useMatches, useRouter } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useAccount } from './use-account'

 

interface IGameFinishedData {
  roomId: string
  winner: TOpponentUserData
  loser: TOpponentUserData
}


export function useBattle() {
  const { user: account } = useAccount()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [opponentInfo, setOpponentInfo] = useState<TOpponentUserData | null>(
    null,
  )
  const ws = useWebSocket('/battle')

  const [myLastOpponent, setMyLastOpponent] =
    useState<TOpponentUserData | null>(null)

  const [myInfo, setMyInfo] = useState<TOpponentUserData>({
    userId: Number(account?.id),
    photoUrl: String(account?.photo_url),
    nickname: String(account?.username),
    bet: 0,
    clicks: 0,
    invitedBy: Number(account?.id),
  })

  const [isMeViewMyOpponent, setIsMeViewMyOpponent] = useState(false)

  const [isMeViewMyOpponent0, setIsMeViewMyOpponent0] = useState(false)

  const [isMeViewMyOpponent1, setIsMeViewMyOpponent1] = useState(false)

  const router = useRouter()
  const pathnames = useMatches()
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  useEffect(() => {
    ws.connect()

    ws.on('connect', () => {
      setIsSocketConnected(true)
    })

    ws.on('waiting_for_players', (data: unknown) => {
      const d = data as { roomId: string }
      setRoomId(d.roomId)
    })

    ws.on('get_private_room_data', (data: unknown) => {
      const d = data as { roomId: string; roomInfo: Array<TOpponentUserData> }
      const opponent = d.roomInfo.find(
        (user: TOpponentUserData) => user.userId !== account?.id,
      )
      const me = d.roomInfo.find(
        (user: TOpponentUserData) => user.userId === account?.id,
      )
      if (opponent) {
        setOpponentInfo(opponent)
        setMyLastOpponent(opponent)
      }
      if (me) {
        setMyInfo(me)
      }
      setRoomId(d.roomId)
    })

    ws.on('game_started', (data: unknown) => {
      const d = data as { roomId: string; users: Array<TOpponentUserData> }
      const opponent = d.users.find(
        (user: TOpponentUserData) => user.userId !== account?.id,
      )
      const me = d.users.find(
        (user: TOpponentUserData) => user.userId === account?.id,
      )
      if (opponent) {
        setOpponentInfo((prevInfo) => (prevInfo ? prevInfo : opponent))
        setMyLastOpponent(opponent)
      }
      if (me) {
        setMyInfo(me)
      }
      setRoomId(d.roomId)
    })

    ws.on('me_view_my_opponent', (data: unknown) => {
      const d = data as { userId: number }
      if (d.userId === account?.id) {
        setIsMeViewMyOpponent0(true)
      } else {
        setIsMeViewMyOpponent1(true)
      }
    })

    ws.on('click_update', (data: unknown) => {
      const d = data as { users: Array<TOpponentUserData> }
      const opponent = d.users.find(
        (user: TOpponentUserData) => user.userId !== account?.id,
      )

      const me = d.users.find(
        (user: TOpponentUserData) => user.userId === account?.id,
      )
      if (opponent) {
        setOpponentInfo(opponent)
      }
      if (me) {
        setMyInfo(me)
      }
    })

    ws.on('game_finished', (data: unknown) => {
      const d = data as IGameFinishedData
      const isWinner = d.winner.userId === account?.id

      const me = isWinner ? d.winner : d.loser

      const opponent = isWinner ? d.loser : d.winner

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
          bet: betConverter[String(d.winner.bet)],
          photoUrl: me.photoUrl,
          opponentPhotoUrl: opponent.photoUrl,
        },
      })
    })

    ws.on('error', () => {
      console.log('socket error')
    })

    ws.on('disconnect', () => {
      setIsSocketConnected(false)
    })

    return () => {
      ws.off('connect')
      ws.off('waiting_for_players')
      ws.off('get_private_room_data')
      ws.off('game_started')
      ws.off('me_view_my_opponent')
      ws.off('click_update')
      ws.off('game_finished')
      ws.off('error')
      ws.off('disconnect')
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
    (bet: number, isPrivate?: boolean, invitedBy?: number) => {
      if(isPrivate) {
        ws.emit('join_or_create_private_room', {
        bet,
        userId: Number(account?.id),
        photoUrl: account?.photo_url,
        nickname: account?.username,
        invitedBy: Number(invitedBy),
      })
      }
      ws.emit('join_or_create_room', {
        bet,
        userId: Number(account?.id),
        photoUrl: account?.photo_url,
        nickname: account?.username,
      })
    },
    [account],
  )



    // socket.emit('get_private_room_data', {
    //   bet,
    //   invitedBy,
    //   userId: Number(account?.id),
    //   photoUrl: String(account?.photo_url),
    //   nickname: String(account?.username),
    //   clicks: 0,    
    // })

// minigame/battle/get_private_room_data
// post('minigame/battle/get_private_room_data', {
//   bet,
//   invitedBy,
//   userId: Number(account?.id),
//   photoUrl: String(account?.photo_url),
//   nickname: String(account?.username),
//   clicks: 0,
// })

  const leaveGame = useCallback((roomId_: string) => {
    ws.emit('leave_room', {
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
      ws.emit('click', {
        roomId: roomId_,
        userId: account?.id,
      })
    },
    [account],
  )

  const clickX2 = useCallback(
    (roomId_: string) => {
      ws.emit('click_x2', {
        roomId: roomId_,
        userId: account?.id,
      })
    },
    [account],
  )

  const isMeViewMyOpponentEmit = useCallback(
    (roomId_: string) => {
      ws.emit('is_me_view_my_opponent', {
        roomId: roomId_,
        userId: account?.id,
      })
    },
    [account],
  )

  const isMeReady = useCallback(
    (roomId_: string) => {
      ws.emit('is_me_ready', {
        roomId: roomId_,
        userId: account?.id,
      })
    },
    [account],
  )

  const forceDisconnect = useCallback(() => {
    ws.emit('force_disconnect', {})
    ws.disconnect()
  }, [])

  const isFinishedGame = useCallback((roomId_: string) => {
    ws.emit('finish_game', {
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
    isSocketConnected,
  }
}
