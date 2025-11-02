'use client'

import { useMatches, useRouter } from '@tanstack/react-router'
import {
  backButton,
  closingBehavior,
  init,
  isTMA,
  miniApp,
  swipeBehavior,
  viewport,
} from '@telegram-apps/sdk'
import { useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ENV } from '@/lib/constants'
import { useBattle } from '@/hooks/api/use-battle'
import { AppContext } from '@/context/app-context'

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathnames = useMatches()
  const { isSocketConnected, forceDisconnect } = useBattle()
  const { currentOnboardingSlide } = useContext(AppContext)
  /** ***************************************************************/
  /*                           TWA Init                            */
  /** ***************************************************************/

  useEffect(() => {
    if (ENV === 'production' && !isTMA()) {
      router.navigate({ to: '/auth-error' })
      return
    }

    ;(async () => {
      if (isTMA()) {
        init()
        miniApp.mountSync()

        // fullscreen mode - ON
        if (viewport.mount.isAvailable()) {
          await viewport.mount()
        }
        if (viewport.requestFullscreen.isAvailable()) {
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

        if (miniApp.setBackgroundColor.isAvailable()) {
          miniApp.setBackgroundColor('#121312')
        }
      }
    })()
  }, [])

  /** ***************************************************************/
  /*                        TWA Back Button                        */
  /** ***************************************************************/
  useEffect(() => {
    ;(async () => {
      if (await isTMA()) {
        if (backButton.mount.isAvailable()) {
          await backButton.mount()
        }

        if (
          (pathnames[1].pathname === '/' ||
            pathnames[1].pathname === '/home') &&
          backButton.hide.isAvailable()
        ) {
          await backButton.hide()
        } else {
          if (backButton.show.isAvailable()) {
            await backButton.show()
          }
        }

        if (backButton.onClick.isAvailable()) {
          backButton.onClick(() => {
            if (pathnames[1].pathname === '/home') return
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
            router.navigate({ to: '/home' })
          })
        }
      }
    })()
  }, [pathnames, currentOnboardingSlide])

  // Production
  // if (isTMA()) {
  //   return (
  //     <TwaAnalyticsProvider
  //       projectId="Id"
  //       apiKey="Key"
  //     >
  //       children
  //     </TwaAnalyticsProvider>
  //   )
  // }

  // Development
  return children
}
