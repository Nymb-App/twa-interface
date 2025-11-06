import { createContext, useContext, useMemo } from 'react'
import { WebSocketService } from '../services/web-socket-service'

class WebSocketManager {
  private apiBaseUrl: string
  private services = new Map<string, WebSocketService>()

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl
  }

  get(namespace: string): WebSocketService {
    const key = namespace
    const existing = this.services.get(key)
    if (existing) return existing
    const url = `${this.apiBaseUrl}${namespace}`
    const service = new WebSocketService(url)
    this.services.set(key, service)
    return service
  }
}

const WebSocketContext = createContext<WebSocketManager | null>(null)

interface IWebSocketProviderProps {
  children: React.ReactNode
  apiBaseUrl: string
}

export function WebSocketProvider({
  children,
  apiBaseUrl,
}: IWebSocketProviderProps) {
  const manager = useMemo(() => new WebSocketManager(apiBaseUrl), [apiBaseUrl])

  return (
    <WebSocketContext.Provider value={manager}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = (namespace: string) => {
  const ctx = useContext(WebSocketContext)
  if (!ctx) throw new Error('useWebSocket must be used within provider')
  return ctx.get(namespace)
}
