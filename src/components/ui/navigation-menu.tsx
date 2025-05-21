import { Link, useMatches } from '@tanstack/react-router'
import { navItems } from '@/constants/nav-items'
import { cn } from '@/utils'

export const NavigationMenu = () => {
  const isActiveLink = useMatches()
  return (
    <nav>
      <ul className="navigation-menu-bg py-4 px-3 flex justify-between items-center rounded-t-4xl pb-8 border border-b-[#121312B2]/70 border-r-[#121312B2]/70 border-l-[#121312B2]/70 border-t-[#FFFFFF1F]">
        {navItems.map(({ to, label, icon: Icon, isLocked }) => (
          <li
            key={to}
            className={cn(
              'relative flex flex-col items-center justify-center w-[68.4px] h-[32px] text-xs rounded-full transition-colors text-gray-400',
            )}
          >
            <Link
              disabled={isLocked}
              aria-disabled={isLocked}
              to={to}
              activeOptions={{ exact: true }}
              activeProps={{
                className: 'text-[#B6FF00] font-medium relative',
              }}
            >
              <span
                className={cn(
                  'flex flex-col items-center gap-1',
                  isLocked && 'blur-[5px]',
                  isActiveLink[1].pathname === to &&
                    'before:content-[""] before:absolute before:inset-0 before:mx-auto before:my-auto before:bg-[#B6FF00] before:filter before:blur-[30px] before:opacity-60 before:-z-10',
                )}
              >
                {isActiveLink[1].pathname === to ? (
                  <Icon fill="#B6FF00" fillOpacity="1" />
                ) : (
                  <Icon />
                )}

                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
