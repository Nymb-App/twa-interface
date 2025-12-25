import { useMatches, useRouter } from '@tanstack/react-router'
import {
  backButton,
  closingBehavior,
  initFp,
  isTMA,
  miniApp,
  swipeBehavior,
  viewport,
} from '@tma.js/sdk'
import type { ReactNode } from 'react'
import { useContext, useEffect } from 'react'
// import useSound from 'use-sound';

import { AppContext } from '@/context/app-context'
import { useBattle } from '@/hooks/api/use-battle'
import { ENV } from '@/lib/constants'
import useSound from 'use-sound'

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathnames = useMatches()
  const { isSocketConnected, forceDisconnect } = useBattle()
  const { currentOnboardingSlide } = useContext(AppContext)
  const [play] = useSound('/sounds/Button.aac')
  /** ***************************************************************/
  /*                           TWA Init                            */
  /** ***************************************************************/

  useEffect(() => {
    initFp()
  }, [])

  useEffect(() => {
    if (ENV === 'production' && !isTMA()) {
      router.navigate({ to: '/auth-error' })
      return
    }

    ;(async () => {
      if (isTMA()) {
        initFp()
        // miniApp.mountSync()
        // fullscreen mode - ON
        if (viewport.mount.isAvailable()) {
          await viewport.mount()
          await viewport.requestFullscreen()
        }

        // enable closing behavior - ON
        if (closingBehavior.mount.isAvailable()) {
          await closingBehavior.mount()
        }
        if (closingBehavior.mount.isAvailable()) {
          await closingBehavior.enableConfirmation()
        }

        // disable swipe mode - ON
        if (swipeBehavior.mount.isAvailable()) {
          await swipeBehavior.mount()
        }
        if (swipeBehavior.disableVertical.isAvailable()) {
          await swipeBehavior.disableVertical()
        }

        if (miniApp.setBgColor.isAvailable()) {
          miniApp.setBgColor('#121312')
        }
      }
    })()
  }, [])

  useEffect(() => {
    console.log(backButton.isMounted(), 'back button mounted?')
  })

  /** ***************************************************************/
  /*                        TWA Back Button                        */
  /** ***************************************************************/
  useEffect(() => {
    ;(async () => {
      if (isTMA()) {
        if (backButton.mount.isAvailable()) {
          backButton.mount()
        }

        if (pathnames[1].pathname === '/' && backButton.hide.isAvailable()) {
          await backButton.hide()
        } else {
          if (backButton.show.isAvailable()) {
            await backButton.show()
          }
        }

        if (backButton.onClick.isAvailable()) {
          play()
          backButton.onClick(() => {
            if (pathnames[1].pathname === '/') return
            if (pathnames[1].pathname === '/onboarding') {
              if (!currentOnboardingSlide) return
              if (currentOnboardingSlide.selectedScrollSnap() === 0) {
                return
              }
              currentOnboardingSlide.scrollPrev()
              return
            }

            if (pathnames[1].pathname === '/unlock-gate') {
              router.navigate({ to: '/gate' })
              return
            }
            if (pathnames[1].pathname === '/send-gift') {
              router.navigate({ to: '/frens' })
              return
            }
            if (
              isSocketConnected &&
              pathnames[1].pathname !== '/minigames/battle'
            ) {
              forceDisconnect()
            }

            router.navigate({ to: '/' })
          })
        }
      }
    })()
  }, [pathnames, currentOnboardingSlide])

  return children
}
