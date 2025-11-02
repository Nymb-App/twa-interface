import { useState } from 'react'
import { toast } from 'sonner'
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
import { CloseIcon } from '@/assets/icons/close'
import { useMint } from '@/hooks/use-mint'
import { LazyVideo } from '@/components/lazy-video'

export function ItemNFT({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mintProgress, mint } = useMint();
  const amount = 1;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} key="item-nft">
      <DrawerTrigger
        className={cn(
          'w-full h-[128px] bg-gradient-to-b from-white/20 to-white/0 rounded-2xl p-[1px] cursor-pointer outline-none',
          className,
        )}
      >
        <div className="relative flex items-end gap-2 bg-[#0E140E] rounded-2xl px-4 py-2 h-full">
          <div className="absolute left-1/2 -translate-x-1/2 w-full h-full top-0 overflow-hidden rounded-2xl">
            <div className="absolute left-[-120px] bottom-[15px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />
            <div className="absolute right-[-50px] top-[-45px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />
          </div>

          <div className="inline-flex justify-between w-full font-pixel">
            <div className='flex flex-col items-start mb-5'>
              <span className="text-white text-base">NFT LEFT</span>
              <div className="inline-flex gap-2 items-center font-pixel mx-auto text-[#B6FF00] -mt-1">
                <h2 className="text-[32px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
                  {mintProgress ? `${mintProgress.progress.toFixed()}%` :  '45%'}
                </h2>
                <div className="flex flex-col text-sm">
                  <span className='ml-2'>ALREADY</span>
                  <span>MINTED</span>
                </div>
              </div>
            </div>

            <img
              src="/shop/nft.webp"
              alt="time"
              className="absolute bottom-0 right-5 max-w-[140px] h-auto"
            />
          </div>
        </div>
      </DrawerTrigger>

      <DrawerContent className="bg-[#0b0b0b] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute flex justify-center items-center top-[16px] right-[16px] w-[32px] h-[32px] bg-[#1D1F1D] rounded-[32px] cursor-pointer"
        >
          <CloseIcon />
        </button>
        <DrawerHeader className="text-center">
          <DrawerTitle className="font-pixel text-white text-2xl">
            BUY NFT
          </DrawerTitle>
          <DrawerDescription className="text-white/60 font-inter text-sm">
            Get what you want right now
          </DrawerDescription>
        </DrawerHeader>

        <div className="relative">
          {/* <FlickeringGrid
            className="absolute left-2 w-full h-[200px] mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
            squareSize={2}
            gridGap={12}
            color="#B6FF00"
            maxOpacity={1}
            flickerChance={0.3}
            autoResize={false}
          /> */}
          <LazyVideo
            className="mx-auto max-w-[240px] w-full rounded-2xl"
            src="/webm/nft.mp4"
            poster="/webm/mint-video-placeholder.png"
          />
        </div>

        {/* <div className="relative">
            <LazyVideo
              className="mx-auto"
              src="/webm/nft.mp4"
              poster="/webm/mint-video-placeholder.png"
            />
            <div className="absolute w-full h-[90px] bg-gradient-to-b from-[#0b0b0b]/50 from-20% to-[#161715] pointer-events-none -bottom-1" />
          </div> */}

        <div className="relative inline-flex justify-around items-center w-full">
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
            amount={amount}
            className="py-3 w-full inline-flex justify-center items-center gap-1 uppercase"
            onTransferSuccess={async (hash) => {
              toast.success('NFT purchased!')
              await mint(hash)
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
            {amount} GET NFT
          </TransferTonButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
