import { useLvl } from '../use-lvl'
import { useApi } from './use-api'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export interface GlobalStatisticsParams {
  lvl?: number
  page?: number
  limit?: number
}

export interface GlobalStatisticsData {
  totalCount: number
  page: number
  users: {
    avatarId: string
    lvl: number
    telegramId: number
    time: number
    nickname?: string
    photoUrl?: string
  }[]
}

export interface StatisticsData {
  lvl: number
  time: number
  energy: number
  place: number
} // [12, 11, ..., 1]

export const useStatistics = () => {
  const { get } = useApi()
  const { lvls } = useLvl()
  const [enabledLevels, setEnabledLevels] = useState<number[]>([12, 11, 10])

  const myStatistics = useQuery<StatisticsData, Error>({
    queryKey: ['myStatistics'],
    queryFn: async () => {
      const response = await get('/statistics/get_my_statistics')
      if (!response) {
        throw new Error('No response from server')
      }
      return response as StatisticsData
    },
    staleTime: 60 * 60 * 1000, // 1 hour cache
  })

  const loadLevel = (level: number) => {
    if (!enabledLevels.includes(level)) {
      setEnabledLevels((prev) => [...prev, level])
    }
  }

  // Используем useQueries для параллельного получения данных по всем уровням
  const levelQueries = useQueries({
    queries: lvls.map((lvl) => ({
      queryKey: ['globalStatistics', lvl],
      queryFn: async () => {
        const response = await get(
          `/statistics/get_global_statistics?lvl=${lvl}`,
        )
        if (!response) {
          throw new Error(`No response from server for level ${lvl}`)
        }
        return {
          level: lvl,
          data: response as GlobalStatisticsData,
        }
      },
      staleTime: 60 * 60 * 1000,
      enabled: enabledLevels.includes(lvl), // Загружаем только активные уровни
    })),
  })

  // Объединяем результаты всех запросов
  const globalStatistics = {
    data: levelQueries.reduce(
      (acc, query) => {
        if (query.data) {
          acc[query.data.level] = query.data.data
        }
        return acc
      },
      {} as Record<number, GlobalStatisticsData>,
    ),
    isLoading: levelQueries.some((query) => query.isLoading),
    isError: levelQueries.some((query) => query.isError),
    error: levelQueries.find((query) => query.isError)?.error,
    // Функция для загрузки конкретного уровня
    loadLevel,
  }

  return {
    myStatistics,
    globalStatistics,
  }
}
