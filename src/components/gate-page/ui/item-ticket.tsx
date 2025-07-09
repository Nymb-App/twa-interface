import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { TShopItem } from '@/hooks/api/use-shop'
import { cn } from '@/lib/utils'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TonIcon } from '@/assets/icons/ton'
import { TelegramStarIcon } from '@/assets/icons/telegram-star'
import { TransferTonButton } from '@/components/transfer-ton-button'
import { useShop } from '@/hooks/api/use-shop'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CloseIcon } from '@/assets/icons/close'
import { ShoppingBagIcon } from '@/assets/icons/shopping-bag-icon'
import { TicketIcon } from '@/assets/icons/ticket'

export function ItemTicket({ className, onClick }: { className?: string, onClick?: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [radioValue, setRadioValue] = useState('5 tickets')
  const amount = useMemo(() => {
    if (radioValue === '1 ticket') return 1
    if (radioValue === '5 tickets') return 4
    if (radioValue === '10 tickets') return 8
  }, [radioValue])
  const itemName = useMemo(() => {
    if (radioValue === '1 ticket') return 'ticket'
    if (radioValue === '5 ticket') return 'five_tickets'
    if (radioValue === '10 year') return 'ten_tickets'
  }, [radioValue])
  const { buyItem } = useShop()

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} key="item-ticket">
      <DrawerTrigger
        onClick={onClick}
        className={cn(
          'w-fit rounded-2xl cursor-pointer outline-none inline-flex justify-center items-center gap-3 py-4 px-6 text-[#B6FF00] bg-[#232A13]',
          className,
        )}
      >
        <ShoppingBagIcon />
        Buy 1 ticket and open the gate 
      </DrawerTrigger>

      <DrawerContent className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
        <button
          onClick={() => setIsOpen(false)}
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
            color="#B6FF00"
            maxOpacity={1}
            flickerChance={0.3}
            autoResize={false}
          />
          <div className="absolute left-1/2 -translate-x-1/2 bg-[#0e2c08] blur-[60px] size-[126px] rounded-full" />
          <TicketIcon
            className="absolute left-1/2 -translate-x-1/2 w-[126px] h-auto top-0"
          />
        </div>

        <RadioGroup
          defaultValue="5 tickets"
          value={radioValue}
          onValueChange={(value) => {
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
                  'font-pixel py-1.5 px-6 rounded-[8px] cursor-pointer text-xs uppercase',
                  radioValue === option
                    ? 'outline outline-[#B6FF00] text-[#B6FF00] bg-[linear-gradient(360deg,_rgba(182,255,0,0.24)_0%,_rgba(182,255,0,0)_100%)]'
                    : 'bg-gradient-to-b from-[#171816] to-[#1E1F1D] text-white/40',
                )}
              >
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>

        <div className="relative inline-flex justify-around items-center w-full">
          <div className="font-pixel flex flex-col gap-1 w-[98px]">
            <span className="text-[#B6FF00] text-3xl text-center">+{radioValue === '1 ticket' ? 1 : radioValue === '5 tickets' ? 5 : 10}</span>
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
