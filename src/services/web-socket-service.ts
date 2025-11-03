import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

export class WebSocketService {
  private socket: Socket
  private queue: Array<{ event: string; payload: unknown }> = []

  constructor(baseUrl: string, token?: string) {
    this.socket = io(baseUrl, {
      autoConnect: false,
      auth: { token },
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      this.queue.forEach((q) => this.socket.emit(q.event, q.payload))
      this.queue = []
    })
  }

  connect() {
    if (!this.socket.connected) this.socket.connect()
  }

  disconnect() {
    this.socket.disconnect()
  }

  emit(event: string, payload: unknown) {
    if (!this.socket.connected) {
      this.queue.push({ event, payload })
      this.connect()
      return
    }
    this.socket.emit(event, payload)
  }

  on(event: string, handler: (...args: Array<unknown>) => void) {
    this.socket.on(event, handler)
  }

  off(event: string, handler?: (...args: Array<unknown>) => void) {
    this.socket.off(event, handler)
  }
}
