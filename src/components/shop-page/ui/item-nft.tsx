import { CloseIcon } from '@/assets/icons/close'
import { LazyVideo } from '@/components/lazy-video'
import { TransferTonButton } from '@/components/transfer-ton-button'
import { Card } from '@/components/ui/card'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useMint } from '@/hooks/use-mint'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

export function ItemNFT({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { mintProgress, mint } = useMint()
  const amount = 1

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} key="item-nft">
      <DrawerTrigger
        className={cn(
          'w-full h-[166px] bg-gradient-to-b from-[#A2F21D] via-[#1B9E98]/50 to-[#162016]/10 rounded-3xl p-[1px] cursor-pointer outline-none',
          className,
        )}
      >
        <div className="relative flex items-end gap-2 bg-[#0E140E] rounded-3xl px-6 py-2 h-full">
          <div className="absolute left-1/2 -translate-x-1/2 w-full h-full top-0 overflow-hidden rounded-3xl">
            <div className="absolute left-[-120px] bottom-[15px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />

            <div className="absolute right-[-50px] top-[-45px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />

            <div className="absolute left-[-105px] top-14 bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />

            <div className="absolute left-[-120px] top-0 bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />

            <div className="absolute right-[10px] top-[-45px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />

            <div className="absolute right-[-50px] bottom-[-45px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />

            <div className="absolute left-[-60px] bottom-[-25px] bg-[#B6FF00]/50 blur-[30px] w-full h-[50px] rounded-full" />
          </div>

          <div className="inline-flex justify-between w-full font-pixel">
            <div className="flex flex-col items-start justify-between h-[166px]">
              <div className="flex flex-col items-start mt-9 relative z-10">
                <span className="text-white text-base uppercase">Nymb NFT</span>
                <span className="text-white/40 text-xs font-inter">
                  One for the wallet
                </span>
              </div>
              <div className="inline-flex relative z-20 gap-2 items-center font-pixel mx-auto text-[#B6FF00] -mt-1">
                <h2 className="text-[32px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
                  {mintProgress ? `${mintProgress.progress.toFixed()}%` : '45%'}
                </h2>
                <div className="flex flex-col text-sm">
                  <span className="ml-2">ALREADY</span>
                  <span>MINTED</span>
                </div>
              </div>
            </div>

            <img
              src="/shop/nft.png"
              alt="time"
              className="absolute bottom-0 right-2.5 max-w-[180px] h-auto"
            />
            <div className="absolute left-[0px] rounded-3xl bottom-[0px] overflow-hidden size-full">
              <div className="absolute left-[-60px] bottom-[-25px] bg-[#B6FF00]/50 blur-[30px] w-full h-[50px] rounded-full" />
            </div>
          </div>
        </div>
      </DrawerTrigger>

      <DrawerContent className="overflow-hidden h-[750px] bg-[#0b0b0b] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute z-50 flex justify-center items-center top-[16px] right-[16px] w-[32px] h-[32px] bg-[#1D1F1D] rounded-[32px] cursor-pointer"
        >
          <CloseIcon />
        </button>
        <DrawerHeader className="relative text-center z-10">
          <DrawerTitle className="font-pixel text-white text-2xl">
            BUY NFT
          </DrawerTitle>
          <DrawerDescription className="text-white/60 font-inter text-sm">
            Get what you want right now
          </DrawerDescription>
        </DrawerHeader>

        <Card className="absolute inset-0 !rounded-[0px] w-full flex flex-col bg-[#0b0b0b]">
          <div className="relative mt-[100px]">
            <LazyVideo
              className="mx-auto"
              src="/webm/nft.mp4"
              poster="/webm/mint-video-placeholder.png"
            />
            {/* <div className="absolute w-full h-[90px] bg-gradient-to-b from-[#0b0b0b]/50 from-20% to-[#161715] pointer-events-none -bottom-1" /> */}
          </div>
          <div className="absolute w-full h-full bg-[url('/index-page/nft-bg.png')] bg-cover bg-top pointer-events-none" />
          <div className="inline-flex gap-2 items-center font-pixel mx-auto text-[#B6FF00] z-10 -mt-17">
            <h2 className="text-[32px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
              45%
            </h2>
            <div className="flex flex-col text-sm">
              <span>ALREADY</span>
              <span>MINTED</span>
            </div>
          </div>
          <div className="mt-6 px-4 relative">
            <TransferTonButton
              // disabled={isMintDisabled}
              recipient="UQBLtmzfUtD0QDe6zLYJSOd_O9f3nwaD1kuNmuD1rrktyjNs"
              amount={amount}
              className="py-4 w-full inline-flex justify-center items-center gap-1"
              onTransferSuccess={async (hash) => {
                toast.success('NFT purchased!')
                await mint(hash)
              }}
              onError={(e) => {
                if (e.message === 'Insufficient balance') {
                  toast.error('Insufficient balance')
                } else {
                  toast.error('An error occurred during payment')
                }
              }}
            >
              MINT FOR {amount} TON
            </TransferTonButton>
          </div>
          <span className="mt-3 text-[#B6FF00]/60 mx-auto">
            One for the wallet
          </span>
        </Card>

        {/* <div className="relative inline-flex justify-around items-center w-full">
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
        </div> */}

        {/* <DrawerFooter className="relative mt-6 mb-4">
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
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  )
}
