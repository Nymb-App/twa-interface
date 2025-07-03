import { useCallback, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount } from './use-account'
import type { Socket } from 'socket.io-client'

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
  const { authToken } = useAuth()

  const fetchData = useCallback(
    async (method: MethodName, url: string, body?: unknown) => {
      if (!authToken) {
        console.error('No auth token available for API request.')
        throw new Error('Authentication token is not available.')
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
  token: string
  isLoginVerified: boolean
}

// --- Helper Functions ---
const setToken = (token: string) => {
  document.cookie = `Authorization-Token=${token}; path=/; max-age=3600; ${
    import.meta.env.VITE_PUBLIC_ENV === 'production' ? 'Secure;' : ''
  }SameSite=Lax`
}

const getAuthToken = () => {
  const match = document.cookie.match(/(^| )Authorization-Token=([^;]+)/)
  return match ? match[2] : null
}

const verifyToken = async (token: string | null): Promise<AuthResponse> => {
  if (!token) {
    throw new Error('No token provided for verification')
  }
  const res = await fetch(`${baseUrl}/accounts/login?token=${token}`)
  if (!res.ok) {
    throw new Error(`Auth verification failed: ${res.status}`)
  }
  return res.json()
}

const login = async (initData: string | undefined): Promise<AuthResponse> => {
  if (!initData) {
    throw new Error('No initData provided for login')
  }
  const res = await fetch(`${baseUrl}/accounts/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData }),
  })

  if (!res.ok) {
    throw new Error(`Authorization failed: ${res.status}`)
  }

  const data = await res.json()
  if (!data.token) {
    throw new Error('No token in response')
  }
  return data
}

// --- Auth Hook ---
export function useAuth() {
  const queryClient = useQueryClient()
  const { initData } = useAccount()

  const authToken = getAuthToken()

  const authQuery = useQuery({
    queryKey: ['auth', authToken],
    queryFn: () => verifyToken(authToken),
    enabled: !!authToken, // Only run if a token exists
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Retry once on failure
  })

  const loginMutation = useMutation({
    mutationFn: () => login(initData),
    onSuccess: (data) => {
      setToken(data.token)
      // Invalidate auth query to re-verify with the new token
      // and also refetch account data
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
    },
  })

  // Automatically trigger login if no valid token is found and we are not already fetching
  useEffect(() => {
    if (!authToken && !authQuery.isLoading && !loginMutation.isPending) {
      loginMutation.mutate()
    }
  }, [
    authToken,
    authQuery.isLoading,
    loginMutation.isPending,
    loginMutation.mutate,
  ])

  return {
    isAuthTokenValid: authQuery.data?.isLoginVerified ?? false,
    isLoading: authQuery.isLoading || loginMutation.isPending,
    error: authQuery.error?.message || loginMutation.error?.message,
    login: loginMutation.mutate,
    authToken,
  }
}
