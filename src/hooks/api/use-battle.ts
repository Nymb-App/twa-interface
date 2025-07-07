import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

const baseUrl = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:100'

const socketUrl = `${baseUrl}/battle`

// WebSocket hook with TanStack Query integration
export function useWebSocketApi<T = unknown>(eventKey: string) {
  const queryClient = useQueryClient()
  const queryKey = ['websocket', eventKey]
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(socketUrl)
    socketRef.current = socket
  }, [eventKey, queryKey, queryClient])

  const emit = useCallback((eventName: string, data?: any) => {
    const ws = socketRef.current
    if (ws && ws.connected) {
      ws.emit(eventName, data)
      console.log(`Emitted event '${eventName}':`, data)
    } else {
      console.error('Socket not connected, cannot emit event.')
    }
  }, [])

  const on = useCallback(
    (eventName: string, handler: (...args: Array<any>) => void) => {
      const ws = socketRef.current
      if (ws) {
        ws.on(eventName, handler)
        console.log(`Registered handler for event '${eventName}'`)
      }

      return () => {
        if (ws) {
          ws.off(eventName, handler)
          console.log(`Unregistered handler for event '${eventName}'`)
        }
      }
    },
    [],
  )

  const disconnect = useCallback(() => {
    const ws = socketRef.current
    if (ws) {
      console.log('Manually disconnecting socket...')
      ws.disconnect()
    }
  }, [])

  const queryResult = useQuery<T>({
    queryKey,
    queryFn: () => {
      // Initial data fetch if needed
      return new Promise(() => {}) // Placeholder, actual implementation depends on your API
    },
    staleTime: 0, // Always consider WebSocket data fresh
    refetchOnWindowFocus: false,
  })

  return {
    ...queryResult,
    emit,
    on,
    disconnect,
  }
}
