import { useWebSocket } from '@/provider/web-socket-provider'
import { useMatches, useRouter } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useEffectEvent } from 'use-effect-event'
import { useAccount } from './use-account'

 

export interface IUser {
    id: number,
    clicks?: number,
    photoUrl?: string,
    nickname?: string,

}
export interface IRoom {
    id: string,
    bet: number,
    isPrivate: boolean,
    maxUsersCount: number,
    createdAt: number,
    createdBy: number,
    users: Array<IUser>,
    deadline?: number,
}

interface IGameFinishedData {
  roomId: string
  winner: IUser
  loser: IUser
}


export function useBattle() {
  const { user: account } = useAccount()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [opponentInfo, setOpponentInfo] = useState<IUser | null>(
    null,
  )
  const [roomData, setRoomData] = useState<IRoom | null>(null)
  const ws = useWebSocket('/battle')

  const [myLastOpponent, setMyLastOpponent] =
    useState<IUser | null>(null)

  const [myInfo, setMyInfo] = useState<IUser>({
    id: Number(account?.id),
    photoUrl: String(account?.photo_url),
    nickname: String(account?.username),
    // bet: 0,
    clicks: 0,
    // invitedBy: Number(account?.id),
  })

  const [isMeViewMyOpponent, setIsMeViewMyOpponent] = useState(false)

  const [isMeViewMyOpponent0, setIsMeViewMyOpponent0] = useState(false)

  const [isMeViewMyOpponent1, setIsMeViewMyOpponent1] = useState(false)

  const router = useRouter()
  const pathnames = useMatches()
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  const onConnect = useEffectEvent(() => {
    setIsSocketConnected(true)
  })

  const onWaitingForPlayers = useEffectEvent((data: IRoom) => {
    setRoomId(data.id)
    setRoomData(data)
  })

  // const onPrivateRoomData = useEffectEvent((data: unknown) => {
  //   const d = data as { roomId: string; roomInfo: Array<TOpponentUserData> }
  //   const opponent = d.roomInfo.find(
  //     (user: TOpponentUserData) => user.userId !== account?.id,
  //   )
  //   const me = d.roomInfo.find(
  //     (user: TOpponentUserData) => user.userId === account?.id,
  //   )
  //   if (opponent) {
  //     setOpponentInfo(opponent)
  //     setMyLastOpponent(opponent)
  //   }
  //   if (me) {
  //     setMyInfo(me)
  //   }
  //   setRoomId(d.roomId)
  // })

  const onGameStarted = useEffectEvent((data: unknown) => {
    if(!account) return
    // console.log(account,'account')
    const d = data as IRoom
    // console.log(d, 'room data on game started')
    const opponent = d.users.find(
      (user: IUser) => user.id !== account.id,
    )
    // console.log(opponent, 'opponent')
    const me = d.users.find(
      (user: IUser) => user.id === account.id,
    )
    // console.log(me, 'me')
    if (opponent) {
      setOpponentInfo((prevInfo) => (prevInfo ? prevInfo : opponent))
      setMyLastOpponent(opponent)
    }
    if (me) {
      setMyInfo(me)
    }
    setRoomId(d.id)
    setRoomData(d)
  })

  const onMeViewMyOpponent = useEffectEvent((data: unknown) => {
    const d = data as { userId: number }
    if (d.userId === account?.id) {
      setIsMeViewMyOpponent0(true)
    } else {
      setIsMeViewMyOpponent1(true)
    }
  })

  const onClickUpdate = useEffectEvent((data: unknown) => {
    const d = data as { users: Array<IUser> }
    const opponent = d.users.find(
      (user: IUser) => user.id !== account?.id,
    )
    const me = d.users.find(
      (user: IUser) => user.id === account?.id,
    )
    if (opponent) {
      setOpponentInfo(opponent)
    }
    if (me) {
      setMyInfo(me)
    }
  })

  const onGameFinished = useEffectEvent((data: unknown) => {
    const d = data as IGameFinishedData
    const isWinner = d.winner.id === account?.id
    const me = isWinner ? d.winner : d.loser
    const opponent = isWinner ? d.loser : d.winner
    const betConverter = {
      '86400': '1 day',
      '604800': '1 week',
      '2592000': '1 month',
      '31536000': '1 year',
    }

    setMyInfo({
      id: Number(account?.id),
      photoUrl: String(account?.photo_url),
      nickname: String(account?.username),
      // bet: 0,
      clicks: 0,
    })
    setMyLastOpponent(opponent)
    setOpponentInfo(null)
    setRoomId(null)

    router.navigate({
      to: '/minigames/battle-result',
      search: {
        myNickname: me.nickname as string,
        opponentNickname: opponent.nickname as string,
        isMeWinner: isWinner,
        // bet: betConverter[String(d.winner.bet)],
        bet: betConverter['86400'],
        photoUrl: me.photoUrl as string,
        opponentPhotoUrl: opponent.photoUrl as string,
      },
    })
  })

  const onError = useEffectEvent((err?: unknown) => {
    console.log('socket error', err)
  })

  const onDisconnect = useEffectEvent(() => {
    setIsSocketConnected(false)
  })

  const onReady = useEffectEvent((data: unknown) => {
    const d = data as { userId: number }
    // if (d.userId === account?.id) {
    //   setIsReady(true)
    // }
  })

  useEffect(() => {
    ws.connect()

    const hConnect = () => onConnect()
    const hWaiting = (p: unknown) => onWaitingForPlayers(p as IRoom)
    const hGameStarted = (p: unknown) => onGameStarted(p as IRoom)
    const hMeView = (p: unknown) => onMeViewMyOpponent(p)
    const hClickUpdate = (p: unknown) => onClickUpdate(p)
    const hGameFinished = (p: unknown) => onGameFinished(p)
    const hReady = (p: unknown) => onReady(p)
    const hError = (e?: unknown) => onError(e)
    const hDisconnect = () => onDisconnect()

    ws.on('connect', hConnect)
    ws.on('ready', hReady)
    ws.on('waiting_for_players', hWaiting)
    ws.on('game_started', hGameStarted)
    ws.on('me_view_my_opponent', hMeView)
    ws.on('click', hClickUpdate)
    ws.on('finish_game', hGameFinished)
    ws.on('error', hError)
    ws.on('disconnect', hDisconnect)

    return () => {
      ws.off('connect', hConnect)
      ws.off('waiting_for_players', hWaiting)
      ws.off('game_started', hGameStarted)
      ws.off('me_view_my_opponent', hMeView)
      ws.off('click', hClickUpdate)
      ws.off('finish_game', hGameFinished)
      ws.off('error', hError)
      ws.off('disconnect', hDisconnect)
    }
  }, [ws])

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
    (params: {user: IUser, bet?: number, isPrivate?: boolean, invitedBy?: number}) => {
      if(!params.isPrivate) {
        ws.emit('join_or_create_room', {
          user: params.user,
          bet: params.bet,
      })
      return
      }
      ws.emit('join_or_create_room', {
        user: params.user,
        bet: params.bet,
        invitedBy: params.invitedBy,
        isPrivate: params.isPrivate,
      })
    },
    [],
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

  const leaveGame = useCallback(() => {
    ws.emit('finish_game')
    setMyInfo({
      id: Number(account?.id),
      photoUrl: String(account?.photo_url),
      nickname: String(account?.username),
      // bet: 0,
      clicks: 0,
    })
    setOpponentInfo(null)
    setRoomId(null)
  }, [])

  const click = useCallback(
    (isX2: boolean = false) => {
      ws.emit('click', {
        isX2,
      })
    },
    [],
  )

  // const clickX2 = useCallback(
  //   (roomId_: string) => {
  //     ws.emit('click_x2', {
  //       roomId: roomId_,
  //       userId: account?.id,
  //     })
  //   },
  //   [account],
  // )

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
    () => {
      ws.emit('ready')
    },
    [account],
  )

  const forceDisconnect = useCallback(() => {
    ws.emit('finish_game')
    ws.disconnect()
  }, [])

  const isFinishedGame = useCallback(() => {
    ws.emit('finish_game')
  }, [])

  return {
    makeBet,
    leaveGame,
    click,
    opponentInfo,
    myInfo,
    roomData,
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
