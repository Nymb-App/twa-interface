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
import { useAccountMe } from '@/hooks/api/use-account'
import { TaskNames, useTasks } from '@/hooks/api/use-tasks'
import { useMint } from '@/hooks/use-mint'
import { ITEM_NFT_PRICE, RECEIVER_ADDRESS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import useSound from 'use-sound'

export function ItemNFT({ className }: { className?: string }) {
  const { accountQuery } = useAccountMe();
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { mintProgress, mint } = useMint()
  const [play, { stop }] = useSound('/sounds/Button.aac')
  const { completeTask } = useTasks();

  const isMintDisabled = useMemo(() => {
    console.log('is minded', accountQuery.data)
    if(!accountQuery.data) return true;
    if(accountQuery.data?.isEarlyAccessMinted === undefined) return false;
    return accountQuery.data.isEarlyAccessMinted;
  }, [accountQuery.data]);

  useEffect(() => {
    return () => stop()
  }, [play])

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} key="item-nft">
      <DrawerTrigger
        className={cn(
          'w-full h-[166px] bg-linear-to-b from-[#A2F21D] via-[#1B9E98]/50 to-[#162016]/10 rounded-3xl p-[1px] cursor-pointer outline-none',
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
              src="/shop/nft4x.webp"
              alt="time"
              className="absolute bottom-0 right-2.5 max-w-40 h-auto"
            />
            <div className="absolute left-0 rounded-3xl bottom-0 overflow-hidden size-full">
              <div className="absolute left-[-60px] bottom-[-25px] bg-[#B6FF00]/50 blur-[30px] w-full h-[50px] rounded-full" />
            </div>
          </div>
        </div>
      </DrawerTrigger>

      <DrawerContent className="overflow-hidden h-[750px] bg-[#0b0b0b] rounded-t-[32px]! border-t-2 border-[#2f302e] pt-3">
        <button
          onClick={() => {
            play()
            setIsOpen(false)
          }}
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
              disabled={isMintDisabled}
              recipient={RECEIVER_ADDRESS}
              amount={ITEM_NFT_PRICE}
              className="py-4 w-full inline-flex justify-center items-center gap-1"
              onTransferSuccess={async (hash) => {
                toast.success('NFT purchased!')
                completeTask({taskName: TaskNames.MintNFT});
                await mint(hash)
                accountQuery.refetch();
              }}
              onError={(e) => {
                if (e.message === 'Insufficient balance') {
                  toast.error('Insufficient balance')
                } else {
                  toast.error('An error occurred during payment')
                }
              }}
            >
              {accountQuery.data?.isEarlyAccessMinted
                ? 'ALREADY MINTED' :
                `MINT FOR ${ITEM_NFT_PRICE} TON`
              }
            </TransferTonButton>
          </div>
          <span className="mt-3 text-[#B6FF00]/60 mx-auto">
            One for the wallet
          </span>
        </Card>
      </DrawerContent>
    </Drawer>
  )
}
