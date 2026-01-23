/* eslint-disable import/consistent-type-specifier-style */
import type { CarouselApi } from '@/components/ui/carousel'
import { useMatches } from '@tanstack/react-router'
// eslint-disable-next-line sort-imports
import { createContext, useEffect, useState, type ReactNode } from 'react'

interface IAppContext {
  isGameStarted?: boolean
  giftPeriodRadioValue: string
  giftCountValue: number
  battleGameRewardRadioValue: string
  currentOnboardingSlide: CarouselApi | undefined
  isGetCheckInReward: boolean
  isOnboardingCompleted: boolean
  isBattleGameBackgroundMusicActive: boolean
  setIsGameStarted: (value: boolean) => void
  setGiftPeriodRadioValue: (value: string) => void
  setGiftCountValue: (value: number) => void
  setBattleGameRewardRadioValue: (value: string) => void
  setCurrentOnboardingSlide: (value: CarouselApi | undefined) => void
  setIsGetCheckInReward: (value: boolean) => void
  setIsOnboardingCompleted: (value: boolean) => void
  setIsBattleGameBackgroundMusicActive: (value: boolean) => void
}

export const AppContext = createContext<IAppContext>({
  isGameStarted: false,
  giftPeriodRadioValue: 'weeks',
  giftCountValue: 24,
  battleGameRewardRadioValue: '1 weeks',
  currentOnboardingSlide: undefined,
  isGetCheckInReward: false,
  isOnboardingCompleted: false,
  isBattleGameBackgroundMusicActive: false,
  setIsGameStarted: () => {},
  setGiftPeriodRadioValue: () => {},
  setGiftCountValue: () => {},
  setBattleGameRewardRadioValue: () => {},
  setCurrentOnboardingSlide: () => {},
  setIsGetCheckInReward: () => {},
  setIsOnboardingCompleted: () => {},
  setIsBattleGameBackgroundMusicActive: () => {},
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
  const [isOnboardingCompleted, setIsOnboardingCompleted] =
    useState<boolean>(false)
  const [
    isBattleGameBackgroundMusicActive,
    setIsBattleGameBackgroundMusicActive,
  ] = useState<boolean>(false)
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)

  const pathnames = useMatches()

  useEffect(() => {
    if (pathnames[1].pathname !== '/') {
      setIsGameStarted(true)
    }
  }, [pathnames])

  return (
    <AppContext.Provider
      value={{
        isGameStarted,
        isBattleGameBackgroundMusicActive,
        isGetCheckInReward,
        isOnboardingCompleted,
        giftPeriodRadioValue,
        giftCountValue,
        battleGameRewardRadioValue,
        currentOnboardingSlide,
        setIsGameStarted,
        setIsBattleGameBackgroundMusicActive,
        setIsGetCheckInReward,
        setIsOnboardingCompleted,
        setGiftPeriodRadioValue,
        setGiftCountValue,
        setBattleGameRewardRadioValue,
        setCurrentOnboardingSlide,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
