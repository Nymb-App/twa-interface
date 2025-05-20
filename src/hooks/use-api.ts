'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

const baseUrl = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:100'
const devInitData =
  'user=%7B%22id%22%3A649685983%2C%22first_name%22%3A%22Dmitriy%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22polienko161%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FyJ_JeNbEN5vPQROkivhZRAoHz5wqfZ1To3Mo_e5EULA.svg%22%7D&chat_instance=-7293269513689266275&chat_type=sender&auth_date=1743505634&signature=QPjIV0WZgTB_g-7R43jvO-Vktj7o-SvRCACHQzVEwBw-GLCFUE59JgBSXV9vImmAySK9w_IoVZSNnI6K-FEoCA&hash=c2061dcd32363814b406676c58eacd394a3c249b80f69fe3f0ea8162a0837932'

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

export function useAuth() {
  const [isAuthTokenValid, setAuthTokenValid] = useState<boolean>(false)
  const authToken = useMemo(() => {
    const match = document.cookie.match(/(^| )Authorization-Token=([^;]+)/)
    return match ? match[2] : null // Возвращает токен или null, если куки не найдены
  }, [])

  useEffect(() => {
    if (!authToken) return
    ;(async () => {
      const res = await fetch(baseUrl + `/accounts/login?token=${authToken}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        console.error('Auth error!')
        return
      }

      const data = await res.json()
      const isVerified = data.isLoginVerified ?? false

      setAuthTokenValid(isVerified)
    })()
  }, [authToken])

  const authorize = async () => {
    const res = await fetch(baseUrl + '/accounts/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initData:
          import.meta.env.VITE_PUBLIC_ENV === 'production'
            ? devInitData
            : devInitData,
      }),
    })

    if (!res.ok) {
      console.error('Auth error!')
      return
    }

    // Получаем токен из ответа
    const data = await res.json()
    const token = data.token // Пример: токен должен быть в ответе

    // Записываем токен в куки
    document.cookie = `Authorization-Token=${token}; path=/; max-age=3600; ${import.meta.env.VITE_PUBLIC_ENV === 'production' ? 'Secure;' : ''}SameSite=Lax`
  }

  return {
    authToken,
    isAuthTokenValid,
    authorize,
  }
}
