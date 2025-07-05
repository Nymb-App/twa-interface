/* eslint-disable @typescript-eslint/naming-convention */
import { useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount } from './use-account'
import type { UseQueryOptions } from '@tanstack/react-query'

const baseUrl = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:100'

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT'

// interface ApiResponse<T = unknown> {
//   data?: T
//   error?: string
//   status: number
// }

interface ApiConfig {
  skipAuth?: boolean
  headers?: Record<string, string>
  signal?: AbortSignal
  params?: Record<string, unknown>
}

export function useApi() {
  const { authToken } = useAuth()

  const fetchData = useCallback(
    async <T = unknown>(
      method: HttpMethod,
      url: string,
      body?: unknown,
      config: ApiConfig = {},
    ): Promise<T> => {
      const { skipAuth = false, headers = {}, signal } = config

      if (!skipAuth && !authToken) {
        throw new Error('Authentication token is not available')
      }

      const isBodyAllowed = !['GET', 'HEAD'].includes(method)
      const requestUrl = baseUrl + url

      const response = await fetch(requestUrl, {
        method,
        headers: {
          ...(!skipAuth && { Authorization: `Bearer ${authToken}` }),
          ...(isBodyAllowed && { 'Content-Type': 'application/json' }),
          ...headers,
        },
        body: isBodyAllowed && body ? JSON.stringify(body) : undefined,
        signal,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'API request failed')
      }

      // Handle no-content responses
      if (response.status === 204) {
        return {} as T
      }

      return response.json()
    },
    [authToken],
  )

  // Create a query wrapper with proper typing
  const useApiQuery = <T = unknown>(
    key: string | Array<string>,
    url: string,
    options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'> & {
      params?: Record<string, unknown>
      config?: Omit<ApiConfig, 'signal'>
    },
  ) => {
    const queryKey = Array.isArray(key)
      ? key
      : [key, ...(options?.params ? [options.params] : [])]

    return useQuery<T, Error>({
      queryKey,
      queryFn: async ({ signal }) => {
        const queryParams = options?.params
          ? `?${new URLSearchParams(
              Object.entries(options.params).reduce(
                (acc, [uniqueKey, value]) => {
                  if (value !== undefined) {
                    acc[uniqueKey] = String(value)
                  }
                  return acc
                },
                {} as Record<string, string>,
              ),
            )}`
          : ''

        return fetchData('GET', `${url}${queryParams}`, undefined, {
          ...options?.config,
          signal,
        })
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    })
  }

  // Create a mutation wrapper
  const useApiMutation = <T = unknown, V = unknown>(
    method: HttpMethod,
    url: string,
    options?: {
      onSuccess?: (data: T) => void
      onError?: (error: Error) => void
      config?: ApiConfig
    },
  ) => {
    const queryClient = useQueryClient()

    return useMutation<T, Error, V>({
      mutationFn: async (variables: V) => {
        return fetchData<T>(method, url, variables, options?.config)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries()
        options?.onSuccess?.(data)
      },
      onError: (error) => {
        options?.onError?.(error)
      },
    })
  }

  return {
    get: <T = unknown>(
      url: string,
      params?: Record<string, unknown>,
      config?: ApiConfig,
    ) => fetchData<T>('GET', url, undefined, { ...config, params }),
    post: <T = unknown, V = unknown>(
      url: string,
      body?: V,
      config?: ApiConfig,
    ) => fetchData<T>('POST', url, body, config),
    put: <T = unknown, V = unknown>(
      url: string,
      body?: V,
      config?: ApiConfig,
    ) => fetchData<T>('PUT', url, body, config),
    patch: <T = unknown, V = unknown>(
      url: string,
      body?: V,
      config?: ApiConfig,
    ) => fetchData<T>('PATCH', url, body, config),
    del: <T = unknown>(url: string, config?: ApiConfig) =>
      fetchData<T>('DELETE', url, undefined, config),
    useQuery: useApiQuery,
    useMutation: useApiMutation,
  }
}

// WebSocket hook with TanStack Query integration
export function useWebSocketApi<T = unknown>(eventKey: string) {
  const queryClient = useQueryClient()
  const queryKey = ['websocket', eventKey]

  useEffect(() => {
    const socket = io(baseUrl)

    socket.on(eventKey, (data: T) => {
      queryClient.setQueryData(queryKey, data)
    })

    return () => {
      socket.disconnect()
    }
  }, [eventKey, queryKey, queryClient])

  return useQuery<T>({
    queryKey,
    queryFn: () => {
      // Initial data fetch if needed
      return new Promise(() => {}) // Placeholder, actual implementation depends on your API
    },
    staleTime: 0, // Always consider WebSocket data fresh
    refetchOnWindowFocus: false,
  })
}

// Auth related types and functions
interface AuthResponse {
  token: string
  isLoginVerified: boolean
}

const setToken = (token: string) => {
  const secureFlag =
    import.meta.env.VITE_PUBLIC_ENV === 'production' ? 'Secure;' : ''
  document.cookie = `Authorization-Token=${token}; path=/; max-age=3600; ${secureFlag}SameSite=Lax`
}

const getAuthToken = () => {
  const match = document.cookie.match(/(^| )Authorization-Token=([^;]+)/)
  return match ? match[2] : null
}

const verifyToken = async (token: string | null): Promise<AuthResponse> => {
  if (!token) {
    throw new Error('No token provided for verification')
  }
  const response = await fetch(`${baseUrl}/accounts/login?token=${token}`)
  if (!response.ok) {
    throw new Error(`Auth verification failed: ${response.status}`)
  }
  return response.json()
}

const login = async (initData: string | undefined): Promise<AuthResponse> => {
  if (!initData) {
    throw new Error('No initData provided for login')
  }

  const response = await fetch(`${baseUrl}/accounts/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Login failed')
  }

  return response.json()
}

export function useAuth() {
  const queryClient = useQueryClient()
  const { initData } = useAccount()
  const authToken = getAuthToken()

  // Verify token query
  const authQuery = useQuery<AuthResponse, Error>({
    queryKey: ['auth', authToken],
    queryFn: () => verifyToken(authToken),
    enabled: !!authToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Login mutation
  const loginMutation = useMutation<AuthResponse, Error>({
      retry: false,
    mutationFn: () => {
      if (!initData) {
        throw new Error('No initData available')
      }
      return login(initData)
    },
    onSuccess: (data) => {
      setToken(data.token)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      queryClient.invalidateQueries({ queryKey: ['account'] })
    },
  })

  // Auto-login if no valid token
  useEffect(() => {
    if (
      !authToken &&
      !authQuery.isLoading &&
      !loginMutation.isPending &&
      !loginMutation.isError
    ) {
      loginMutation.mutate()
    }
  }, [authToken, authQuery.isLoading, loginMutation])

  return {
    authToken,
    isAuthenticated: authQuery.isSuccess,
    isLoading: authQuery.isLoading || loginMutation.isPending,
    error: authQuery.error || loginMutation.error,
    login: loginMutation.mutate,
    logout: () => {
      document.cookie =
        'Authorization-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      queryClient.clear()
    },
  }
}
