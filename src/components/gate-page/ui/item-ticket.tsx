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

export function ItemTicket({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [radioValue, setRadioValue] = useState('1 week')
  const amount = useMemo(() => {
    if (radioValue === '1 day') return 0.87
    if (radioValue === '1 week') return 4.7
    if (radioValue === '1 year') return 27
  }, [radioValue])
  const itemName = useMemo(() => {
    if (radioValue === '1 day') return 'time'
    if (radioValue === '1 week') return 'time_one_week'
    if (radioValue === '1 year') return 'time_one_year'
  }, [radioValue])
  const { buyItem } = useShop()

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} key="item-ticket">
      <DrawerTrigger
        className={cn(
          'w-full h-[128px] bg-gradient-to-b from-[#A2F21D] via-[#1B9E98]/50 to-[#162016] rounded-2xl p-[1px] cursor-pointer outline-none',
          className,
        )}
      >
        <div className="relative flex items-end gap-2 bg-[#0E140E] rounded-2xl px-4 py-2 h-full">
          <FlickeringGrid
            className="absolute left-1/2 -translate-x-1/2 w-full h-full top-0 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
            squareSize={2}
            gridGap={12}
            color="#B6FF00"
            maxOpacity={1}
            flickerChance={0.3}
            autoResize={false}
          />
          <div className="absolute left-1/2 -translate-x-1/2 w-full h-full top-0 overflow-hidden rounded-2xl">
            <div className="absolute left-0 top-[-45px] bg-[#B6FF00] blur-[60px] w-1/3 h-[50px] rounded-full" />
            <div className="absolute right-0 top-[-45px] bg-[#B6FF00] blur-[60px] w-1/3 h-[50px] rounded-full" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[-32px] w-full">
            <img
              src="/shop-clock-img.webp"
              alt="time"
              className="absolute left-1/2 -translate-x-1/2 w-[96px] h-auto top-0"
            />
          </div>

          <div className="inline-flex justify-between w-full font-pixel">
            <span className="text-white text-base">TIME RESERVE</span>
            <span className="text-[#B6FF00] text-lg inline-flex items-center gap-1">
              <span>1D</span>
              <span className="text-[#B6FF00]/40 text-xs">/</span>
              <span>1W</span>
              <span className="text-[#B6FF00]/40 text-xs">/</span>
              <span>1Y</span>
            </span>
          </div>
        </div>
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
            TIME RESERVE
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
          <img
            src="/shop-clock-img.webp"
            alt="time"
            className="absolute left-1/2 -translate-x-1/2 w-[126px] h-auto top-0"
          />
        </div>

        <RadioGroup
          defaultValue="1 week"
          value={radioValue}
          onValueChange={(value) => {
            setRadioValue(value)
          }}
          className="flex gap-3 justify-center mb-5 mt-40 relative"
        >
          {['1 day', '1 week', '1 year'].map((option) => (
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
            <span className="text-[#B6FF00] text-3xl text-center">+1</span>
            <span className="text-white/40 text-xs text-center">
              {radioValue === '1 day'
                ? 'DAY'
                : radioValue === '1 week'
                  ? 'WEEK'
                  : 'YEAR'}
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
