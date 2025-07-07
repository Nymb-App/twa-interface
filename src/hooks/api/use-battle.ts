import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import { useAccount } from './use-account';
import type { TOpponentUserData } from '@/components/battle-page/battle-intro-scene';

const baseUrl = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:100'
const socket = io(`${baseUrl}/battle`)

// WebSocket hook with TanStack Query integration
export function useBattle() {
  const { user: account } = useAccount();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [opponentInfo, setOpponentInfo] = useState<TOpponentUserData | null>(null);
  const [myInfo, setMyInfo] = useState<TOpponentUserData>({
    userId: account?.id!,
    photoUrl: account?.photo_url!,
    nickname: account?.username!,
    bet: 0,
    clicks: 0,
  });

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log(`Connected with id: ${socket.id}`)
    })

    socket.on('waiting_for_players', (data) => {
      console.log(`Waiting for players`, data)
      setRoomId(data.roomId);
    })


    socket.on('game_started', (data) => {
      console.log(`Game started`, data)
      const opponent = data.users.filter((user: TOpponentUserData) => user.userId !== account?.id)[0];
      const me = data.users.filter((user: TOpponentUserData) => user.userId === account?.id)[0];
      if(opponent !== undefined || opponent !== null) {
        setOpponentInfo(opponent);
      }
      if(me !== undefined || me !== null) {
        setMyInfo(me);
      }

      setRoomId(data.roomId);
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
      socket.off('error')
      socket.off('disconnect')
    }
  }, [])
  
  console.log("OpponentInfo", opponentInfo);


  const makeBet = useCallback((bet: number) => {
    socket.emit('join_or_create_room', {
      bet,
      userId: account?.id,
      photoUrl: account?.photo_url,
      nickname: account?.username,
    })
  }, [account]);

  const leaveGame = useCallback((roomId: string) => {
    socket.emit('leave_room', {
      roomId,
    });
  }, []);

  const click = useCallback((roomId: string) => {
    socket.emit('click', {
      roomId,
      userId: account?.id,
    });
  }, [account]);


  return {
    makeBet,
    leaveGame,
    click,
    opponentInfo,
    myInfo,
    roomId,
  }
}
