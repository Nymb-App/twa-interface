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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useShop } from '@/hooks/api/use-shop'
import { ITEM_ENERGY_1000_PRICE, RECEIVER_ADDRESS } from '@/lib/constants'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useSound from 'use-sound'

export function DrawerEnergy({
  className,
  children,
  asChild,
}: {
  className?: string
  children?: React.ReactNode
  asChild?: boolean
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { buyItem } = useShop()
  const [play, { stop }] = useSound('/sounds/Button.aac')

  useEffect(() => {
    return () => stop()
  }, [play])

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild={asChild} className={className}>
        {children}
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
            RESTORE ENERGY
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
            color="#9D19FB"
            maxOpacity={1}
            flickerChance={0.3}
            autoResize={false}
          />
          <div className="absolute left-1/2 -translate-x-1/2 bg-[#33105e] blur-[60px] size-[126px] rounded-full" />

          <div className="relative inline-flex justify-between items-center w-full h-[100px] overflow-hidden">
            <img
              src="/shop-intersect.webp"
              alt="energy"
              className="absolute left-10 top-10 max-w-[126px] h-[100px]"
            />
            <img
              src="/shop-intersect.webp"
              alt="energy"
              className="absolute right-10 top-10 scale-x-[-1] max-w-[136px] h-[100px]"
            />
          </div>
          <img
            src="/shop/energy.webp"
            alt="energy"
            className="absolute left-1/2 -translate-x-1/2 size-[146px] top-0"
          />
        </div>

        <div className="relative inline-flex justify-around items-center w-full mt-6">
          <div className="font-pixel flex flex-col gap-1">
            <span className="text-[#9137FF] text-3xl relative bottom-2">
              +1000
            </span>
            <span className="text-white/40 text-xs ml-9">ENERGY</span>
          </div>
          <span className="text-white/40 text-5xl font-pixel">:</span>
          <div className="font-pixel flex flex-col gap-1">
            <span className="text-white text-3xl text-center">
              {ITEM_ENERGY_1000_PRICE}
            </span>
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
            recipient={RECEIVER_ADDRESS}
            amount={ITEM_ENERGY_1000_PRICE}
            className="py-3 w-full inline-flex justify-center items-center gap-1"
            onTransferSuccess={async (hash) => {
              toast.success('Energy restored')
              await buyItem('energy', hash)
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
            {ITEM_ENERGY_1000_PRICE} RESTORE ENERGY
          </TransferTonButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
