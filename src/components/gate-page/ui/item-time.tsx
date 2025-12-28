import { ShoppingBagIcon } from '@/assets/icons/shopping-bag-icon'
import { DrawerTime } from '@/components/ui/drawer-time'
import { cn } from '@/lib/utils'

export function ItemTime({
  className,
  // onClick,
}: {
  className?: string
  // onClick?: () => void
}) {
  return (
    <DrawerTime
      className={cn(
        'w-fit rounded-2xl cursor-pointer outline-none inline-flex justify-center items-center gap-3 py-4 px-6 text-[#B6FF00] bg-[#232A13]',
        className,
      )}
    >
      <ShoppingBagIcon />
      Buy TIME and open the gate
    </DrawerTime>
  )
}
