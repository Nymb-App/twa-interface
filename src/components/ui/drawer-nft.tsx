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
import { useMint } from '@/hooks/use-mint'
import { ITEM_NFT_PRICE, RECEIVER_ADDRESS } from '@/lib/constants'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import useSound from 'use-sound'

export function DrawerNft({
  className,
  children,
  asChild,
}: {
  className?: string
  children?: React.ReactNode
  asChild?: boolean
}) {
  const { accountQuery } = useAccountMe()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { mint } = useMint()
  const [play, { stop }] = useSound('/sounds/Button.aac')

  const tonConnectUI = useTonConnectUI()

  const isMintDisabled = useMemo(() => {
    if (!tonConnectUI[0].connected) return false
    if (!accountQuery.data) return true
    if (accountQuery.data.isEarlyAccessMinted === undefined) return false
    return accountQuery.data.isEarlyAccessMinted
  }, [accountQuery.data, tonConnectUI])

  useEffect(() => {
    return () => stop()
  }, [play])

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} key="item-nft">
      <DrawerTrigger asChild={asChild} className={className}>
        {children}
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
              onConnect={() => {
                setIsOpen(false)
              }}
              onTransferSuccess={async (hash) => {
                toast.success('NFT purchased!')
                await mint(hash)
                accountQuery.refetch()
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
                ? 'ALREADY MINTED'
                : `MINT FOR ${ITEM_NFT_PRICE} TON`}
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
