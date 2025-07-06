import { ActionButton } from './action-button'
import { cn } from '@/utils'
import { useCheckIn } from '@/hooks/use-get-daily-rewards'

export const CheckInButton = ({ className }: { className?: string }) => {
  const { checkIn, isCheckingIn } = useCheckIn()

  return (
    <ActionButton
      onClick={checkIn}
      className={cn('', isCheckingIn && 'bg-[#222A10]', className)}
    >
      <span className="font-pixel text-[#B6FF00] font-[400] uppercase text-[18px] leading-[24px] mix-blend-difference">
        Continue
      </span>
    </ActionButton>
  )
}
