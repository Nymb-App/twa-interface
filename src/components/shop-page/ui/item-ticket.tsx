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
        'w-full h-[128px] bg-linear-to-b from-[#FFB200] to-[#2A1306] rounded-2xl p-[1px] cursor-pointer outline-none',
        className,
      )}
    >
      <div className="relative flex items-end gap-2 bg-linear-to-b from-[#282210] to-[#141310] rounded-2xl px-4 py-2 h-full">
        <img
          src="/shop/ticket-bg.webp"
          alt="bg"
          className="absolute left-0 top-0 rounded-2xl mix-blend-lighten"
        />
        <div className="absolute left-1/2 -translate-x-1/2 top-[-32px] w-full">
          <img
            src="/shop/ticket.webp"
            alt="ticket"
            className="absolute left-1/2 -translate-x-1/2 w-[96px] h-auto top-0"
          />
        </div>

        <div className="relative inline-flex justify-between w-full font-pixel">
          <span className="text-white text-base">GATE TICKET</span>
          <span className="text-[#FBB107] text-lg inline-flex items-center gap-1">
            <span>1</span>
            <span className="text-[#FBB107]/40 text-xs">/</span>
            <span>5</span>
            <span className="text-[#FBB107]/40 text-xs">/</span>
            <span>10</span>
          </span>
        </div>
      </div>
    </DrawerTicket>
  )
}
