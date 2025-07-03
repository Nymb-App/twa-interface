import { Link, useMatches } from '@tanstack/react-router'
import { isMobile } from 'react-device-detect'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { SendGiftButton } from './send-gift-button'
import { SendGiftActionButtons } from './send-gift-action-buttons'
import { CheckInButton } from './check-in-button'
import { JumpToTheNextGateButton } from './jump-to-the-next-gate-button'
import { UnlockGateCloseButton } from './unlock-gate-close-button'
import type { ReactNode } from 'react'
import type { JSX } from 'react/jsx-runtime'
import { cn } from '@/utils'

// SVG Icons
import { StarBoardIcon } from '@/assets/icons/menu-icons/star-board-icon'
import { HomeIcon } from '@/assets/icons/menu-icons/home-icon'
import { FriendsIcon } from '@/assets/icons/menu-icons/friends-icon'
import { TasksIcon } from '@/assets/icons/menu-icons/tasks-icon'

export const PageLayout = ({
  children,
  useFooter = true,
  useSendButton = false,
  useSendGiftActionButtons = false,
  useCheckInButton = false,
  useJumpToTheNextGateButton = false,
  useUnlockGateCloseButton = false,
  className,
  classNameContent,
  setIsStartRoulette,
  setIsShowSendGiftActionButtons,
}: {
  children: ReactNode
  useFooter?: boolean
  useSendButton?: boolean
  useSendGiftActionButtons?: boolean
  useCheckInButton?: boolean
  useJumpToTheNextGateButton?: boolean
  useUnlockGateCloseButton?: boolean
  className?: string
  classNameContent?: string
  setIsStartRoulette?: (value: boolean) => void
  setIsShowSendGiftActionButtons?: (value: boolean) => void
}) => {
  const linkItems = [
    { to: '/star-board', label: 'Star Board', icon: StarBoardIcon },
    { to: '/tasks', label: 'Tasks', icon: TasksIcon },
    { to: '/home', label: 'Home', icon: HomeIcon },
    { to: '/frens', label: 'Frens', icon: FriendsIcon },
    { to: '/locked', label: 'Blured', icon: FriendsIcon, isLocked: true },
  ]

  const pathnames = useMatches()

  useEffect(() => {
    if (pathnames[1].pathname === '/send-gift') {
      document.body.style.backgroundColor = '#151317'
      return
    }
    if (pathnames[1].pathname === '/minigames/battle') {
      document.body.style.backgroundColor = '#03061a'
      return
    }
    document.body.style.backgroundColor = '#121312'
    return () => {
      document.body.style.backgroundColor = '#121312'
    }
  }, [pathnames])

  return (
    <div
      className={cn(
        'relative top-28 mx-auto min-h-[calc(100vh-10rem)] w-full max-w-[450px] overflow-x-hidden bg-[#121312] pb-6 text-white',
        pathnames[1].pathname === '/shop' && 'top-0',
        className,
      )}
    >
      <main
        className={cn(
          useFooter && 'pb-[5rem]',
          useSendButton && 'mb-[5rem] pb-[5rem]',
          classNameContent,
        )}
      >
        {children}
      </main>
      {useFooter && <NavigationMenu linkItems={linkItems} />}
      {useSendButton && (
        <SendGiftButton setIsStartRoulette={setIsStartRoulette} />
      )}
      {useSendGiftActionButtons && (
        <SendGiftActionButtons
          setIsShowSendGiftActionButtons={setIsShowSendGiftActionButtons}
        />
      )}
      {useCheckInButton && <CheckInButton />}
      {useJumpToTheNextGateButton && <JumpToTheNextGateButton />}
      {useUnlockGateCloseButton && <UnlockGateCloseButton />}
      <Toaster
        className="!mb-18"
        position="bottom-center"
        toastOptions={{
          className:
            '!font-inter !text-[#FFFFFF] !font-[400] !leading-[20px] !text-[16px] !border !rounded-[12px] !p-4 !border-[#FFFFFF1F] !bg-[#171914]',
        }}
        duration={5000}
        invert={true}
      />
    </div>
  )
}

const NavigationMenu = ({
  className,
  linkItems,
}: {
  className?: string
  linkItems: Array<{
    to: string
    label: string
    icon: Icon
    isLocked?: boolean
  }>
}) => {
  const isActiveLink = useMatches()

  return (
    <nav
      className={cn(
        'fixed bottom-0 z-50 h-20 w-full max-w-[450px] rounded-t-4xl border-t-2 border-[#2f302e] bg-[linear-gradient(0deg,rgba(18,19,18,0.9)_31%,rgba(18,19,18,0)_100%)] backdrop-blur-[12px]',
        className,
      )}
    >
      <ul className="inline-flex h-12 w-full justify-between">
        {linkItems.map(({ to, label, icon: Icon, isLocked }, index) => (
          <li
            key={`nav-item-${index}`}
            className={cn(
              'flex h-full w-1/5 flex-col items-center justify-center pt-2 text-xs transition-colors',
            )}
          >
            <Link
              to={to}
              disabled={isLocked}
              aria-disabled={isLocked}
              activeOptions={{ exact: true }}
              className={cn(
                'group relative flex flex-col items-center gap-1 text-white/60 transition-colors',
                !isMobile &&
                  isActiveLink[1].pathname !== to &&
                  'duration-200 hover:text-white',
                isLocked && 'blur-[5px] hover:text-white/60',
                isActiveLink[1].pathname === to &&
                  'text-[#B6FF00] before:absolute before:inset-0 before:mx-auto before:my-auto before:bg-[#B6FF00] before:opacity-60 before:blur-[30px] before:filter before:content-[""]',
              )}
            >
              <Icon fill="currentColor" fillOpacity="1" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

type Icon = ({
  fill,
  fillOpacity,
}: {
  fill?: string
  fillOpacity?: string
}) => JSX.Element
