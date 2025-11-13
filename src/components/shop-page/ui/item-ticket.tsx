import { CloseIcon } from '@/assets/icons/close'
import { TelegramStarIcon } from '@/assets/icons/telegram-star'
import { TonIcon } from '@/assets/icons/ton'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { TransferTonButton } from '@/components/transfer-ton-button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TShopItem } from '@/hooks/api/use-shop'
import { useShop } from '@/hooks/api/use-shop'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import useSound from 'use-sound'

export function ItemTicket({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [radioValue, setRadioValue] = useState('5 tickets')
  const amount = useMemo(() => {
    if (radioValue === '1 ticket') return 1
    if (radioValue === '5 tickets') return 4
    if (radioValue === '10 tickets') return 7
  }, [radioValue])
  const itemName = useMemo(() => {
    if (radioValue === '1 ticket') return 'ticket'
    if (radioValue === '5 ticket') return 'five_tickets'
    if (radioValue === '10 tickets') return 'ten_tickets'
  }, [radioValue])
  const { buyItem } = useShop()
  const [play, { stop }] = useSound('/sounds/Button.aac')

  useEffect(() => {
    return () => stop()
  }, [play])

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} key="item-ticket">
      <DrawerTrigger
        onClick={() => {
          play()
          onClick?.()
        }}
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
      </DrawerTrigger>

      <DrawerContent className="bg-[#161714] rounded-t-[32px]! border-t-2 border-[#2f302e] pt-3">
        <button
          onClick={() => {
            play()
            setIsOpen(false)
          }}
          className="absolute flex justify-center items-center top-[16px] right-[16px] w-[32px] h-[32px] bg-[#1D1F1D] rounded-[32px] cursor-pointer"
        >
          <CloseIcon />
        </button>
        <DrawerHeader className="text-center">
          <DrawerTitle className="font-pixel text-white text-2xl">
            TICKETS RESERVE
          </DrawerTitle>
          <DrawerDescription className="text-white/60 font-inter text-sm">
            Get what you want right now
          </DrawerDescription>
        </DrawerHeader>

        <div className="relative">
          <FlickeringGrid
            className="absolute left-2 w-full h-[200px] mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
            squareSize={2}
            gridGap={12}
            color="#FBB107"
            maxOpacity={1}
            flickerChance={0.3}
            autoResize={false}
          />
          <div className="absolute left-1/2 -translate-x-1/2 bg-[#2c2a08] blur-[60px] size-[126px] rounded-full" />
          {/* <TicketIcon className="absolute left-1/2 -translate-x-1/2 w-[126px] h-auto top-0" /> */}
          <img
            src="/shop/ticket.webp"
            alt="ticket"
            className="absolute left-1/2 -translate-x-1/2 w-[126px] h-auto top-0"
          />
        </div>

        <RadioGroup
          defaultValue="5 tickets"
          value={radioValue}
          onValueChange={(value) => {
            play()
            setRadioValue(value)
          }}
          className="flex gap-3 justify-center mb-5 mt-40 relative"
        >
          {['1 ticket', '5 tickets', '10 tickets'].map((option) => (
            <div key={option}>
              <RadioGroupItem
                value={option}
                id={option}
                className="hidden peer"
              />
              <label
                htmlFor={option}
                className={cn(
                  'font-pixel py-1.5 px-3 rounded-[8px] cursor-pointer text-xs uppercase',
                  radioValue === option
                    ? 'outline outline-[#FBB107] text-[#FBB107] bg-[linear-gradient(360deg,rgba(251,177,7,0.24)_0%,rgba(251,177,7,0)_100%)]'
                    : 'bg-linear-to-b from-[#171816] to-[#1E1F1D] text-white/40',
                )}
              >
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>

        <div className="relative inline-flex justify-around items-center w-full">
          <div className="font-pixel flex flex-col gap-1 w-[98px]">
            <span className="text-[#FBB107] text-3xl text-center relative bottom-2">
              +
              {radioValue === '1 ticket'
                ? 1
                : radioValue === '5 tickets'
                  ? 5
                  : 10}
            </span>
            <span className="text-white/40 text-xs text-center">
              {radioValue === '1 ticket'
                ? 'TICKET'
                : radioValue === '5 tickets'
                  ? 'TICKETS'
                  : 'TICKETS'}
            </span>
          </div>
          <span className="text-white/40 text-5xl font-pixel">:</span>
          <div className="font-pixel flex flex-col gap-1 w-[98px]">
            <span className="text-white text-3xl text-center">{amount}</span>
            <Select defaultValue="ton">
              <SelectTrigger className="text-[12px] font-pixel uppercase rounded-[8px] text-white/40 border-none starboard-result-block-bg">
                <div className="flex items-center gap-2">
                  <SelectValue placeholder="Select value" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#121312] border-none !text-white/40 font-pixel">
                <SelectItem
                  className="!bg-[#121312] hover:!bg-[#121312] border-none !text-white/40 hover:!text-white"
                  value="ton"
                >
                  <div className="flex items-center gap-2">
                    <TonIcon /> <span>Ton</span>
                  </div>
                </SelectItem>
                <SelectItem value="stars" className="" disabled>
                  <div className="flex items-center gap-2">
                    <TelegramStarIcon /> <span>Stars</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter className="relative mt-6 mb-4">
          <TransferTonButton
            recipient="UQBLtmzfUtD0QDe6zLYJSOd_O9f3nwaD1kuNmuD1rrktyjNs"
            amount={amount ?? 0.87}
            className="py-3 w-full inline-flex justify-center items-center gap-1 uppercase"
            onTransferSuccess={async (hash) => {
              toast.success('Time purchased')
              await buyItem(itemName as TShopItem, hash)
            }}
            onConnect={() => {
              setIsOpen(false)
            }}
            onError={(e) => {
              if (e.message === 'Insufficient balance') {
                toast.error('Insufficient balance')
              } else {
                toast.error('An error occurred during payment')
              }
            }}
          >
            PAY <TonIcon fill="black" />
            {amount} GET {radioValue}
          </TransferTonButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
