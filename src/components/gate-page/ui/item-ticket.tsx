import { ShoppingBagIcon } from '@/assets/icons/shopping-bag-icon'
import { DrawerTicket } from '@/components/ui/drawer-ticket'
import { cn } from '@/lib/utils'

export function ItemTicket({
  className,
  // onClick,
}: {
  className?: string
  // onClick?: () => void
}) {
  return (
    <DrawerTicket
      className={cn(
        'w-fit rounded-2xl cursor-pointer outline-none inline-flex justify-center items-center gap-3 py-4 px-6 text-[#B6FF00] bg-[#232A13]',
        className,
      )}
    >
      <ShoppingBagIcon />
      Buy TICKET and open the gate
    </DrawerTicket>
  )
}
