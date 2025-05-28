import React, { createContext, useContext, useEffect, useState } from 'react'

export const NYMB_FARMING_FINISHAT_LS_KEY = 'nymb-farming-finishat'
export const NYMB_FARMING_CLAIM_TIME_KEY = 'nymb-farming-duration'
export const ANIMATION_DURATION_COUNTUP = 2000
export const FARMING_DURATION = 10 * 1000
export interface FarmingContextType {
  finishAt: number
  setFinishAt: (value: number) => void
  loading: boolean
}

const FarmingContext = createContext<FarmingContextType | undefined>(undefined)

export const FarmingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [finishAt, setFinishAt] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // Устанавливаем значение с сохранением в localStorage
  const setFinishAtFromLocalStorage = (value: number) => {
    if (value) {
      localStorage.setItem(NYMB_FARMING_FINISHAT_LS_KEY, value.toString())
    } else {
      localStorage.setItem(NYMB_FARMING_FINISHAT_LS_KEY, value.toString())
    }
    setFinishAt(value)
  }

  // Инициализация состояния при загрузке
  useEffect(() => {
    const initialize = () => {
      const savedValue = localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)

      if (savedValue) {
        const numericValue = Number(savedValue)
        if (numericValue > Date.now()) {
          setFinishAt(numericValue)
        } else {
          localStorage.removeItem(NYMB_FARMING_FINISHAT_LS_KEY)
        }
      } else {
        // setFinishAtFromLocalStorage(Number(Date.now() + 2005000))
        setFinishAtFromLocalStorage(Number(Date.now() + 150000))
        // setFinishAtFromLocalStorage(Number(Date.now() + 0))
        // Если нет в localStorage, делаем API запрос
        try {
          // const response = await fetch('/api/farming-end-time');
          // const data = await response.json();
          // if (data.finishAt) {
          //   setFinishAt(data.finishAt);
          // }
        } catch (error) {
          // console.error('Failed to fetch farming end time:', error);
        }
      }

      setLoading(false)
    }

    initialize()
  }, [])

  // Проверяем истечение таймера
  useEffect(() => {
    if (!finishAt) return

    const timer = setInterval(() => {
      if (Date.now() >= finishAt) {
        setFinishAtFromLocalStorage(0)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [finishAt])

  return (
    <FarmingContext.Provider
      value={{
        finishAt,
        setFinishAt: setFinishAtFromLocalStorage,
        loading,
      }}
    >
      {children}
    </FarmingContext.Provider>
  )
}

export const useFarming = () => {
  const context = useContext(FarmingContext)
  if (!context) {
    throw new Error('useFarming must be used within a FarmingProvider')
  }
  return context
}
