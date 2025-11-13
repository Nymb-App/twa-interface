import { BustIcon } from '@/assets/icons/bust'
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
import { useBuyExtraBoost } from '@/hooks/api/use-shop'
import { cn } from '@/utils'
import { useState } from 'react'
import { toast } from 'sonner'
import useSound from 'use-sound'
import BattleDrawerImage from '/minigames/battle-drawer-img.webp'

export function ExtraBoostDrawer({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { buyExtraBoost } = useBuyExtraBoost()
  const [play] = useSound('/sounds/Button.aac')

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        className={cn(
          "font-semibold cursor-pointer bg-[#b6ff00]/10 rounded-[14px] h-full flex justify-center items-center gap-3 px-3 bg-[url('/minigames/boost-green-bg.webp')] bg-no-repeat bg-[position:bottom_left_-1px]",
          className,
        )}
      >
        <span className="ml-[6px]">
          <BustIcon strokeColor="#B6FF00" />
        </span>
        <span className="text-[#B6FF00]">Get Extra</span>
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
          <DrawerTitle className="font-pixel uppercase text-white text-2xl">
            get extra bust
          </DrawerTitle>
          <DrawerDescription className="text-white/60 font-inter text-sm">
            Increase your chances of winning
          </DrawerDescription>
        </DrawerHeader>

        <div className="relative">
          <FlickeringGrid
            className="absolute left-2 w-full h-[200px]  mask-[radial-gradient(ellipse_180px_100px_at_center,black,transparent)]"
            squareSize={2}
            gridGap={12}
            color="#288CFF"
            maxOpacity={10}
            flickerChance={1}
            autoResize={false}
          />

          <img
            src={BattleDrawerImage}
            alt="battle-drawer-image"
            className="absolute left-1/2 -translate-x-1/2 top-0 size-40"
          />
        </div>

        <div className="inline-flex justify-around items-center w-full px-8 mt-50">
          <div className="font-pixel flex flex-col gap-1 text-center ">
            <span className="text-[#288CFF] text-3xl relative bottom-2 [text-shadow:0px_0px_16px_#288CFF]">
              +1
            </span>
            <span className="text-white/40 text-xs block">EXTRA BOOST</span>
          </div>

          <span className="font-pixel text-4xl text-white/40">:</span>

          <div className="font-pixel flex flex-col gap-1 text-center">
            <span className="text-white text-3xl">0.1</span>
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
            amount={0.1}
            className="py-3 w-full inline-flex justify-center items-center gap-1 uppercase"
            onTransferSuccess={async (hash) => {
              toast.success('Extra boost purchase')
              await buyExtraBoost(hash)
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
            Confirm and pay 0.1 Ton
          </TransferTonButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
