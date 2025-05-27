import { createContext, useState } from 'react'
import type { ReactNode } from '@tanstack/react-router'

interface IAppContext {
  isStartRoulette: boolean
  setIsStartRoulette: (value: boolean) => void
  isFinishRoulette: boolean
  setIsFinishRoulette: (value: boolean) => void
  isShowSendGiftButton: boolean
  setIsShowSendGiftButton: (value: boolean) => void
  isShowSendGiftActionButtons: boolean
  setIsShowSendGiftActionButtons: (value: boolean) => void
  giftPeriodRadioValue: string
  giftCountValue: number
  setGiftPeriodRadioValue: (value: string) => void
  setGiftCountValue: (value: number) => void
}

export const AppContext = createContext<IAppContext>({
  isStartRoulette: false,
  isFinishRoulette: false,
  setIsFinishRoulette: () => {},
  setIsStartRoulette: () => {},
  isShowSendGiftButton: true,
  setIsShowSendGiftButton: () => {},
  isShowSendGiftActionButtons: false,
  setIsShowSendGiftActionButtons: () => {},
  giftPeriodRadioValue: 'weeks',
  giftCountValue: 24,
  setGiftPeriodRadioValue: () => {},
  setGiftCountValue: () => {},
})

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [giftPeriodRadioValue, setGiftPeriodRadioValue] = useState('weeks')
  const [giftCountValue, setGiftCountValue] = useState(24)
  const [isStartRoulette, setIsStartRoulette] = useState(false)
  const [isFinishRoulette, setIsFinishRoulette] = useState(false)
  const [isShowSendGiftButton, setIsShowSendGiftButton] = useState(true)
  const [isShowSendGiftActionButtons, setIsShowSendGiftActionButtons] =
    useState(false)

  return (
    <AppContext.Provider
      value={{
        isStartRoulette,
        isFinishRoulette,
        setIsStartRoulette,
        setIsFinishRoulette,
        giftPeriodRadioValue,
        setIsShowSendGiftButton,
        isShowSendGiftButton,
        isShowSendGiftActionButtons,
        setIsShowSendGiftActionButtons,
        giftCountValue,
        setGiftPeriodRadioValue,
        setGiftCountValue,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
