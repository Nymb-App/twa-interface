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
import { useAccount, useAccountMe } from '@/hooks/api/use-account'
import { ITEM_ENERGY_1000_PRICE, RECEIVER_ADDRESS } from '@/lib/constants'
import { useEffect, useRef, useState } from 'react'
import { isIOS } from 'react-device-detect'
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
  const { accountQuery } = useAccountMe()
  const { user } = useAccount()
  const [play, { stop }] = useSound('/sounds/Button.aac')

  const [buyEnergyProgress, setBuyEnergyProgress] = useState(false)
  const buyEnergyIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  )
  const previousEnergyRef = useRef<number | null>(null)

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

  useEffect(() => {
    return () => stop()
  }, [play])

  useEffect(() => {
    return () => {
      if (buyEnergyIntervalRef.current) {
        clearInterval(buyEnergyIntervalRef.current)
        buyEnergyIntervalRef.current = null
      }
    }
  }, [])

  return (
    <Drawer
      key="item-energy"
      modal={false}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <DrawerTrigger
        asChild={asChild}
        className={className}
        onClickCapture={preLockOnClickCapture}
      >
        {children}
      </DrawerTrigger>

      <DrawerContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="bg-[#161714] rounded-t-[32px]! border-t-2 border-[#2f302e] pt-3"
      >
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
            disabled={buyEnergyProgress}
            recipient={RECEIVER_ADDRESS}
            amount={ITEM_ENERGY_1000_PRICE}
            comment={`nymb.shop?type=energy&telegramId=${user?.id}`}
            className="py-3 w-full inline-flex justify-center items-center gap-1"
            onTransferSuccess={(_hash) => {
              setBuyEnergyProgress(true)

              previousEnergyRef.current = accountQuery.data?.energy ?? null

              if (buyEnergyIntervalRef.current) {
                clearInterval(buyEnergyIntervalRef.current)
                buyEnergyIntervalRef.current = null
              }

              const id = setInterval(async () => {
                const res = await accountQuery.refetch()
                const previousEnergy = previousEnergyRef.current
                const nextEnergy = res.data?.energy

                if (
                  typeof nextEnergy === 'number' &&
                  (previousEnergy == null || nextEnergy > previousEnergy)
                ) {
                  clearInterval(id)
                  buyEnergyIntervalRef.current = null
                  previousEnergyRef.current = null
                  setBuyEnergyProgress(false)
                  // toast.success('Energy restored')
                }
              }, 2000)

              buyEnergyIntervalRef.current = id

              // await buyItem('energy', hash)
            }}
            onConnect={() => {
              setIsOpen(false)
            }}
            onError={(e) => {
              setBuyEnergyProgress(false)
              previousEnergyRef.current = null
              if (buyEnergyIntervalRef.current) {
                clearInterval(buyEnergyIntervalRef.current)
                buyEnergyIntervalRef.current = null
              }
              if (e.message === 'Insufficient balance') {
                toast.error('Insufficient balance')
              } else {
                toast.error('An error occurred during payment')
              }
            }}
          >
            {buyEnergyProgress ? (
              'Waiting...'
            ) : (
              <>
                PAY <TonIcon fill="black" />
                {ITEM_ENERGY_1000_PRICE} RESTORE ENERGY
              </>
            )}
          </TransferTonButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
