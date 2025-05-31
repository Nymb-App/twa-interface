import { Link, useMatches } from '@tanstack/react-router'
import { isMobile } from 'react-device-detect'
import { Toaster } from 'sonner'
import { SendGiftButton } from './send-gift-button'
import { SendGiftActionButtons } from './send-gift-action-buttons'
import { CheckInButton } from './check-in-button'
import { JumpToTheNextLockedGateButton } from './jump-to-the-next-gate-locked-button'
import { JumpToTheNextGateButton } from './jump-to-the-next-gate-button'
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
  useJumpToTheNextGateLockedButton = false,
  useJumpToTheNextGateButton = false,
  className,
  setIsStartRoulette,
  setIsShowSendGiftActionButtons,
}: {
  children: ReactNode
  useFooter?: boolean
  useSendButton?: boolean
  useSendGiftActionButtons?: boolean
  useCheckInButton?: boolean
  useJumpToTheNextGateLockedButton?: boolean
  useJumpToTheNextGateButton?: boolean
  className?: string
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
  return (
    <div
      className={cn(
        'relative top-28 pb-6 w-full max-w-[450px] min-h-[calc(100vh-10rem)] mx-auto bg-[#121312] overflow-x-hidden text-white',
        className,
      )}
    >
      <main
        className={cn(
          useFooter && 'pb-[5rem]',
          useSendButton && 'pb-[5rem] mb-[5rem]',
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
      {useJumpToTheNextGateLockedButton && <JumpToTheNextLockedGateButton />}
      {useJumpToTheNextGateButton && <JumpToTheNextGateButton />}
      <Toaster className="!mb-18" />
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
        'fixed bottom-0 w-full max-w-[450px] rounded-t-4xl h-20 z-50 border-t-2 border-[#2f302e] backdrop-blur-[12px] bg-[linear-gradient(0deg,rgba(18,19,18,0.9)_31%,rgba(18,19,18,0)_100%)]',
        className,
      )}
    >
      <ul className="inline-flex justify-between w-full h-12">
        {linkItems.map(({ to, label, icon: Icon, isLocked }, index) => (
          <li
            key={`nav-item-${index}`}
            className={cn(
              'flex flex-col items-center justify-center w-1/5 h-full text-xs transition-colors pt-2',
            )}
          >
            <Link
              to={to}
              disabled={isLocked}
              aria-disabled={isLocked}
              activeOptions={{ exact: true }}
              className={cn(
                'relative group flex flex-col items-center gap-1 text-white/60 transition-colors',
                !isMobile &&
                  isActiveLink[1].pathname !== to &&
                  'duration-200 hover:text-white',
                isLocked && 'blur-[5px] hover:text-white/60',
                isActiveLink[1].pathname === to &&
                  'text-[#B6FF00] before:content-[""] before:absolute before:inset-0 before:mx-auto before:my-auto before:bg-[#B6FF00] before:filter before:blur-[30px] before:opacity-60',
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
