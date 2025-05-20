'use client'

import {
  // backButton,
  closingBehavior,
  init,
  isTMA,
  miniApp,
  swipeBehavior,
  viewport,
} from '@telegram-apps/sdk'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  /** ***************************************************************/
  /*                           TWA Init                            */
  /** ***************************************************************/

  useEffect(() => {
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
  // useEffect(() => {
  //     (async () => {
  //         if (await isTMA()) {
  //             if (backButton.mount.isAvailable()) {
  //                 await backButton.mount();
  //             }

  //             if (
  //                 (pathname === '/' || pathname === '/auth' || pathname === '/dashboard') &&
  //                 backButton.hide.isAvailable()
  //             ) {
  //                 await backButton.hide();
  //             } else {
  //                 if (backButton.show.isAvailable()) {
  //                     await backButton.show();
  //                 }
  //             }

  //             if (backButton.onClick.isAvailable()) {
  //                 backButton.onClick(() => {
  //                     router.back();
  //                 });
  //             }
  //         }
  //     })();
  // }, [pathname]);

  return children
}
