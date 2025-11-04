import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

export class WebSocketService {
  private socket: Socket
  private queue: Array<{ event: string; payload: unknown }> = []
  private lastError: unknown | null = null

  constructor(baseUrl: string) {
    this.socket = io(baseUrl, {
      autoConnect: false,
    })

    this.socket.on('connect', () => {
      this.queue.forEach((q) => this.socket.emit(q.event, q.payload))
      this.queue = []
    })

    this.socket.on('error', (err: unknown) => {
      this.lastError = err
    })

    this.socket.on('connect_error', (err: unknown) => {
      this.lastError = err
    })
  }

  connect() {
    if (!this.socket.connected) this.socket.connect()
  }

  disconnect() {
    this.socket.disconnect()
  }

  emit(event: string, payload?: unknown) {
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

  once(event: string, handler: (...args: Array<unknown>) => void) {
    this.socket.once(event, handler)
  }

  onConnect(handler: (...args: Array<unknown>) => void) {
    this.socket.on('connect', handler)
  }

  offConnect(handler?: (...args: Array<unknown>) => void) {
    this.socket.off('connect', handler)
  }

  onDisconnect(handler: (...args: Array<unknown>) => void) {
    this.socket.on('disconnect', handler)
  }

  offDisconnect(handler?: (...args: Array<unknown>) => void) {
    this.socket.off('disconnect', handler)
  }

  onConnectError(handler: (err: unknown) => void) {
    this.socket.on('connect_error', handler)
  }

  offConnectError(handler?: (err: unknown) => void) {
    this.socket.off('connect_error', handler)
  }

  isConnected() {
    return this.socket.connected
  }

  getLastError() {
    return this.lastError
  }
}
