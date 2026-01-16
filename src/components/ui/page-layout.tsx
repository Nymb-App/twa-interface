import { cn } from '@/lib/utils'
import { Link, useMatches } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { isIOS, isMobile } from 'react-device-detect'
import type { JSX } from 'react/jsx-runtime'
import { Toaster } from 'sonner'
import { SendGiftActionButtons } from './send-gift-action-buttons'
import { UnlockGateCloseButton } from './unlock-gate-close-button'

// SVG Icons
import { FriendsIcon } from '@/assets/icons/menu-icons/friends-icon'
import { HomeIcon } from '@/assets/icons/menu-icons/home-icon'
import { StarBoardIcon } from '@/assets/icons/menu-icons/star-board-icon'
import { TasksIcon } from '@/assets/icons/menu-icons/tasks-icon'
import { useBattle } from '@/hooks/api/use-battle'
import { IoArrowBack, IoChevronBack } from 'react-icons/io5'
import useSound from 'use-sound'
// import useSound from 'use-sound'

export const PageLayout = ({
  children,
  useFooter = true,
  useSendButton = false,
  useSendGiftActionButtons = false,
  useUnlockGateCloseButton = false,
  className,
  classNameContent,
  setIsShowSendGiftActionButtons,
}: {
  children: ReactNode
  useFooter?: boolean
  useSendButton?: boolean
  useSendGiftActionButtons?: boolean
  useUnlockGateCloseButton?: boolean
  className?: string
  classNameContent?: string
  setIsShowSendGiftActionButtons?: (value: boolean) => void
}) => {
  const linkItems = [
    { to: '/star-board', label: 'Star Board', icon: StarBoardIcon },
    { to: '/tasks', label: 'Tasks', icon: TasksIcon },
    { to: '/', label: 'Home', icon: HomeIcon },
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
        className,
      )}
    >
      {pathnames[1].pathname !== '/' &&
        pathnames[1].pathname !== '/onboarding' && (
          <div
            className={cn(
              'fixed max-w-[450px] w-full left-1/2 -translate-x-1/2 top-25 z-1000000',
              !isIOS && 'top-21 left-[calc(50%-5px)]',
            )}
          >
            <BackButton className="ml-4" />
          </div>
        )}
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
      {useSendGiftActionButtons && (
        <SendGiftActionButtons
          setIsShowSendGiftActionButtons={setIsShowSendGiftActionButtons}
        />
      )}

      {useUnlockGateCloseButton && <UnlockGateCloseButton />}
      <Toaster
        className="!mt-20"
        position="top-center"
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

const BackButton = ({ className }: { className?: string }) => {
  const { isSocketConnected, forceDisconnect } = useBattle()
  const [play] = useSound('/sounds/Button.aac', { interrupt: true })
  return (
    <Link
      to="/"
      onClick={() => {
        if (isSocketConnected) {
          forceDisconnect()
        }
        play()
      }}
      className={cn(
        'inline-flex text-white font-semibold text-sm items-center gap-1 justify-between backdrop-blur-md pl-1 pr-3 py-1.5 rounded-full bg-white/10',
        !isIOS && 'bg-black/30',
        className,
      )}
    >
      {isIOS ? <IoChevronBack size={18} /> : <IoArrowBack size={20} />}{' '}
      <span className={cn('text-xs mx-auto', !isIOS && 'text-sm')}>Back</span>
    </Link>
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
  const [playLink] = useSound('/sounds/Button.aac')

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
              onClick={() => {
                if (isLocked) return
                playLink()
              }}
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
