import { AppContext } from '@/context/app-context'
import { useCheckIn } from '@/hooks/use-get-daily-rewards'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { useContext } from 'react'
import { ActionButton } from './action-button'

export const CheckInButton = ({ className }: { className?: string }) => {
  const { checkIn, isCheckingIn } = useCheckIn()
  const { setIsGetCheckInReward } = useContext(AppContext)

  return (
    <Link
      to="/"
      onClick={() => {
        checkIn()
        setIsGetCheckInReward(true)
      }}
    >
      <ActionButton className={cn(isCheckingIn && 'bg-[#222A10]', className)}>
        <span className="font-pixel text-[#B6FF00] font-normal uppercase text-[18px] leading-6 mix-blend-difference">
          Continue
        </span>
      </ActionButton>
    </Link>
  )
}
