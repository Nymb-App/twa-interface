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
import { useEffect, useMemo, useRef, useState } from 'react'
import { isIOS } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
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
  const {t} = useTranslation();
  const { accountQuery } = useAccountMe()
  // const { user } = useAccount()
  // const [isOpen, setIsOpen] = useState<boolean>(false)
  const { mint } = useMint()
  const [play, { stop }] = useSound('/sounds/Button.aac')

  const [mintProgress, setMintProgress] = useState(false)
  const mintIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tonConnectUI = useTonConnectUI()

  const isMintDisabled = useMemo(() => {
    if (mintProgress) return true
    if (!tonConnectUI[0].connected) return false
    if (!accountQuery.data) return true
    if (accountQuery.data.isEarlyAccessMinted === undefined) return false
    return accountQuery.data.isEarlyAccessMinted
  }, [accountQuery.data, tonConnectUI, mintProgress])

  useEffect(() => {
    return () => stop()
  }, [play])

  useEffect(() => {
    return () => {
      if (mintIntervalRef.current) {
        clearInterval(mintIntervalRef.current)
        mintIntervalRef.current = null
      }
    }
  }, [])

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const scrollYRef = useRef(0)
  const closeUnlockTimerRef = useRef<number | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (!isIOS) {
      setIsOpen(open)
      return
    }
    const body = document.body
    if (open) {
      if (closeUnlockTimerRef.current != null) {
        clearTimeout(closeUnlockTimerRef.current)
        closeUnlockTimerRef.current = null
      }
      scrollYRef.current =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0
      body.style.position = 'fixed'
      body.style.top = `-${scrollYRef.current}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      body.style.touchAction = 'none'
    } else {
      if (closeUnlockTimerRef.current != null) {
        clearTimeout(closeUnlockTimerRef.current)
      }
      closeUnlockTimerRef.current = setTimeout(() => {
        const y =
          Math.abs(parseInt(body.style.top || '0', 10)) || scrollYRef.current
        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.right = ''
        body.style.width = ''
        body.style.touchAction = ''
        window.scrollTo(0, y)
        closeUnlockTimerRef.current = null
      }, 350) as unknown as number
    }
    setIsOpen(open)
  }

  useEffect(() => {
    return () => {
      if (!isIOS) return
      const body = document.body
      if (closeUnlockTimerRef.current != null) {
        clearTimeout(closeUnlockTimerRef.current)
        closeUnlockTimerRef.current = null
      }
      const y = scrollYRef.current
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      body.style.touchAction = ''
      if (isOpen) requestAnimationFrame(() => window.scrollTo(0, y))
    }
  }, [isOpen])

  const preLockOnClickCapture = () => {
    if (!isIOS) return
    if (isOpen) return
    const body = document.body
    if (body.style.position === 'fixed') return
    scrollYRef.current =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0
    body.style.position = 'fixed'
    body.style.top = `-${scrollYRef.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.touchAction = 'none'
    window.scrollTo(0, scrollYRef.current)
    requestAnimationFrame(() => window.scrollTo(0, scrollYRef.current))
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      key="item-nft"
      modal={false}
    >
      <DrawerTrigger
        asChild={asChild}
        className={className}
        onClickCapture={preLockOnClickCapture}
      >
        {children}
      </DrawerTrigger>
      <DrawerContent
        className="overflow-hidden h-[750px] bg-[#0b0b0b] rounded-t-[32px]! border-t-2 border-[#2f302e] pt-3"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
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
          <DrawerTitle className="font-pixel text-white text-2xl uppercase">
            {t('shop-page.items.nft.card.title')}
          </DrawerTitle>
          <DrawerDescription className="text-white/60 font-inter text-sm">
            {t('shop-page.items.nft.card.description')}
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
            <div className="flex flex-col text-sm whitespace-pre-line text-left uppercase">
              {t('nft.status.already-minted')}
            </div>
          </div>
          <div className="mt-6 px-4 relative">
            <TransferTonButton
              disabled={isMintDisabled}
              recipient={RECEIVER_ADDRESS}
              amount={ITEM_NFT_PRICE}
              // comment={`nymb.mint?type=nft&telegramId=${user?.id}`}
              className="py-4 w-full inline-flex justify-center items-center gap-1"
              onConnect={() => {
                setIsOpen(false)
              }}
              onTransferSuccess={async (hash) => {
                // setMintProgress(true);
                await mint(hash);

                // if (mintIntervalRef.current) {
                //   clearInterval(mintIntervalRef.current)
                //   mintIntervalRef.current = null
                // }

                // const id = setInterval(async () => {
                //   const res = await accountQuery.refetch()
                //   if (res.data?.isEarlyAccessMinted === true) {
                //     clearInterval(id)
                //     mintIntervalRef.current = null
                //     setMintProgress(false)
                //     // toast.success('NFT purchased!')
                //   }
                // }, 2000)

                // mintIntervalRef.current = id
              }}
              onError={(e) => {
                setMintProgress(false)
                if (mintIntervalRef.current) {
                  clearInterval(mintIntervalRef.current)
                  mintIntervalRef.current = null
                }
                if (e.message === 'Insufficient balance') {
                  toast.error('Insufficient balance')
                } else {
                  toast.error('An error occurred during payment')
                }
              }}
            >
              {accountQuery.data?.isEarlyAccessMinted
                ? t('nft.status.already-minted')
                : mintProgress
                  ? t('nft.status.minting')
                  : t('nft.mint', {amount: ITEM_NFT_PRICE})}
            </TransferTonButton>
          </div>
          <span className="mt-3 text-[#B6FF00]/60 mx-auto">
            {t('nft.description')}
          </span>
        </Card>
      </DrawerContent>
    </Drawer>
  )
}
