'use client'

import { useMatches, useRouter } from '@tanstack/react-router';
import {
  backButton,
  closingBehavior,
  init,
  isTMA,
  miniApp,
  swipeBehavior,
  viewport,
} from '@telegram-apps/sdk';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathnames = useMatches();
  /** ***************************************************************/
  /*                           TWA Init                            */
  /** ***************************************************************/

  useEffect(() => {
    ; (async () => {
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
    (async () => {
      if (await isTMA()) {
        if (backButton.mount.isAvailable()) {
          await backButton.mount();
        }

        if (
          (pathnames[1].pathname === '/' || pathnames[1].pathname === '/home') &&
          backButton.hide.isAvailable()
        ) {
          await backButton.hide();
        } else {
          if (backButton.show.isAvailable()) {
            await backButton.show();
          }
        }

        if (backButton.onClick.isAvailable()) {
          backButton.onClick(() => {
            if (pathnames[1].pathname === '/send-gift') {
              router.navigate({ to: '/frens' });
              return;
            }
            router.navigate({ to: '/home' });
          });
        }
      }
    })();
  }, [pathnames]);

  return children
}
