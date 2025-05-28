import { createContext, useState } from 'react'
import type { ReactNode } from '@tanstack/react-router'

interface IAppContext {
  giftPeriodRadioValue: string
  giftCountValue: number
  setGiftPeriodRadioValue: (value: string) => void
  setGiftCountValue: (value: number) => void
}

export const AppContext = createContext<IAppContext>({
  giftPeriodRadioValue: 'weeks',
  giftCountValue: 24,
  setGiftPeriodRadioValue: () => {},
  setGiftCountValue: () => {},
})

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [giftPeriodRadioValue, setGiftPeriodRadioValue] = useState('weeks')
  const [giftCountValue, setGiftCountValue] = useState(24)

  return (
    <AppContext.Provider
      value={{
        giftPeriodRadioValue,
        giftCountValue,
        setGiftPeriodRadioValue,
        setGiftCountValue,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
