import { useCallback, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { useAccount } from './use-account'

const baseUrl = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:100'

type MethodName =
  | 'GET' // Получение данных
  | 'POST' // Создание нового ресурса
  | 'PUT' // Полное обновление ресурса
  | 'PATCH' // Частичное обновление ресурса
  | 'DELETE' // Удаление ресурса
  | 'HEAD' // Получение заголовков без тела ответа
  | 'OPTIONS' // Получение доступных методов для ресурса
  | 'TRACE' // Отладка маршрута запроса
  | 'CONNECT' // Установка туннеля (обычно для прокси)

export function useApi() {
  const { authToken } = useAuth();

  const fetchData = useCallback(
    async (method: MethodName, url: string, body?: unknown) => {
      if (!authToken) {
        return
      }

      const isBodyAllowed = method !== 'GET' && method !== 'HEAD'

      const response = await fetch(baseUrl + url, {
        method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...(isBodyAllowed && { 'Content-Type': 'application/json' }),
        },
        body: isBodyAllowed && body ? JSON.stringify(body) : undefined,
      })

      const text = await response.text()
      if (!text) {
        return {}
      }

      return JSON.parse(text)

      // return await response.json();
    },
    [authToken],
  )

  // Автоматически создаём методы для всех HTTP-запросов
  const api = useMemo(() => {
    return (
      [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'HEAD',
        'OPTIONS',
        'TRACE',
        'CONNECT',
      ] as Array<MethodName>
    ).reduce(
      (acc, method) => {
        acc[method.toLowerCase()] = (url: string, body?: unknown) =>
          fetchData(method, url, body)
        return acc
      },
      {} as Record<string, (url: string, body?: unknown) => Promise<unknown>>,
    )
  }, [fetchData])

  return {
    get: api.get,
    post: api.post,
    put: api.put,
    patch: api.patch,
    del: api.delete,
    head: api.head,
    options: api.options,
    trace: api.trace,
    connect: api.connect,
  }
}

export function useWebSocketApi(key: string = 'newData') {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [data, setData] = useState<unknown>(null)

  useEffect(() => {
    const newSocket = io(baseUrl)
    setSocket(newSocket)

    newSocket.on(key, (message) => {
      // console.log('📩 Получены новые данные:', message);
      setData(message)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Функция для отправки сообщений на бэкенд
  const sendMessage = useCallback(
    (event: string, payload: unknown) => {
      if (socket) {
        socket.emit(event, payload)
      }
    },
    [socket],
  )

  return { data, sendMessage }
}

interface AuthResponse {
  token: string;
  isLoginVerified: boolean;
}

export function useAuth() {
  const [isAuthTokenValid, setAuthTokenValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { initData } = useAccount();

  const authToken = useMemo(() => {
    const match = document.cookie.match(/(^| )Authorization-Token=([^;]+)/)
    return match ? match[2] : null
  }, [])

  const setToken = useCallback((token: string) => {
    document.cookie = `Authorization-Token=${token}; path=/; max-age=3600; ${import.meta.env.VITE_PUBLIC_ENV === 'production' ? 'Secure;' : ''}SameSite=Lax`
  }, [])

  const verifyToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      const res = await fetch(baseUrl + `/accounts/login?token=${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        throw new Error(`Auth verification failed: ${res.status}`)
      }

      const data = await res.json() as AuthResponse
      return data.isLoginVerified ?? false
    } catch (err) {
      console.error('Token verification error:', err)
      return false
    }
  }, [])

  const authorize = useCallback(async (force: boolean = false) => {
    if (!force && authToken) {
      const isValid = await verifyToken(authToken)
      if (isValid) {
        setAuthTokenValid(true)
        setIsLoading(false)
        return
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(baseUrl + '/accounts/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData,
        }),
      })

      if (!res.ok) {
        throw new Error(`Authorization failed: ${res.status}`)
      }

      const data = await res.json() as AuthResponse
      
      if (!data.token) {
        throw new Error('No token in response')
      }

      setToken(data.token)
      setAuthTokenValid(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during authorization'
      console.error('Authorization error:', errorMessage)
      setError(errorMessage)
      setAuthTokenValid(false)
    } finally {
      setIsLoading(false)
    }
  }, [authToken, setToken, verifyToken])

  // Автоматическая авторизация при монтировании
  useEffect(() => {
    if (!authToken) {
      authorize()
      return
    }

    const checkToken = async () => {
      const isValid = await verifyToken(authToken)
      if (!isValid) {
        await authorize(true)
      } else {
        setAuthTokenValid(true)
      }
      setIsLoading(false)
    }

    checkToken()
  }, [authToken, authorize, verifyToken])

  // Автоматическое обновление токена перед истечением срока
  useEffect(() => {
    if (!authToken || !isAuthTokenValid) return

    const tokenExpirationTime = 3600 * 1000 // 1 час в миллисекундах
    const refreshThreshold = 5 * 60 * 1000 // 5 минут в миллисекундах

    const refreshTimer = setTimeout(() => {
      authorize(true)
    }, tokenExpirationTime - refreshThreshold)

    return () => clearTimeout(refreshTimer)
  }, [authToken, isAuthTokenValid, authorize])

  return {
    authToken,
    isAuthTokenValid,
    isLoading,
    error,
    authorize: () => authorize(true),
  }
}
