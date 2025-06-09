import { createContext, useState } from 'react'
import type { ReactNode } from '@tanstack/react-router'

interface IAppContext {
  giftPeriodRadioValue: string
  giftCountValue: number
  setGiftPeriodRadioValue: (value: string) => void
  setGiftCountValue: (value: number) => void
  battleGameRewardRadioValue: string
  setBattleGameRewardRadioValue: (value: string) => void
}

export const AppContext = createContext<IAppContext>({
  giftPeriodRadioValue: 'weeks',
  giftCountValue: 24,
  setGiftPeriodRadioValue: () => {},
  setGiftCountValue: () => {},
  battleGameRewardRadioValue: '1 weeks',
  setBattleGameRewardRadioValue: () => {},
})

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [giftPeriodRadioValue, setGiftPeriodRadioValue] = useState('weeks')
  const [giftCountValue, setGiftCountValue] = useState(24)
  const [battleGameRewardRadioValue, setBattleGameRewardRadioValue] =
    useState('1 weeks')

  return (
    <AppContext.Provider
      value={{
        giftPeriodRadioValue,
        giftCountValue,
        setGiftPeriodRadioValue,
        setGiftCountValue,
        battleGameRewardRadioValue,
        setBattleGameRewardRadioValue,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
