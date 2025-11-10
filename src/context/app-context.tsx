/* eslint-disable import/consistent-type-specifier-style */
import type { CarouselApi } from '@/components/ui/carousel'
// eslint-disable-next-line sort-imports
import { createContext, useState, type ReactNode } from 'react'

interface IAppContext {
  giftPeriodRadioValue: string
  giftCountValue: number
  setGiftPeriodRadioValue: (value: string) => void
  setGiftCountValue: (value: number) => void
  battleGameRewardRadioValue: string
  setBattleGameRewardRadioValue: (value: string) => void
  currentOnboardingSlide: CarouselApi | undefined
  setCurrentOnboardingSlide: (value: CarouselApi | undefined) => void
  isGetCheckInReward: boolean
  setIsGetCheckInReward: (value: boolean) => void
}

export const AppContext = createContext<IAppContext>({
  giftPeriodRadioValue: 'weeks',
  giftCountValue: 24,
  setGiftPeriodRadioValue: () => {},
  setGiftCountValue: () => {},
  battleGameRewardRadioValue: '1 weeks',
  setBattleGameRewardRadioValue: () => {},
  currentOnboardingSlide: undefined,
  setCurrentOnboardingSlide: () => {},
  isGetCheckInReward: false,
  setIsGetCheckInReward: () => {},
})

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [giftPeriodRadioValue, setGiftPeriodRadioValue] = useState('weeks')
  const [giftCountValue, setGiftCountValue] = useState(24)
  const [battleGameRewardRadioValue, setBattleGameRewardRadioValue] =
    useState('1 weeks')
  const [currentOnboardingSlide, setCurrentOnboardingSlide] = useState<
    CarouselApi | undefined
  >(undefined)
  const [isGetCheckInReward, setIsGetCheckInReward] = useState<boolean>(false)

  return (
    <AppContext.Provider
      value={{
        isGetCheckInReward,
        setIsGetCheckInReward,
        giftPeriodRadioValue,
        giftCountValue,
        setGiftPeriodRadioValue,
        setGiftCountValue,
        battleGameRewardRadioValue,
        setBattleGameRewardRadioValue,
        currentOnboardingSlide,
        setCurrentOnboardingSlide,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
