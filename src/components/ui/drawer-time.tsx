import { CloseIcon } from '@/assets/icons/close'
import { TelegramStarIcon } from '@/assets/icons/telegram-star'
import { TonIcon } from '@/assets/icons/ton'
import {
  ITEM_TIME_1D_PRICE,
  ITEM_TIME_1M_PRICE,
  ITEM_TIME_1W_PRICE,
  ITEM_TIME_1Y_PRICE,
  RECEIVER_ADDRESS,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { isIOS } from 'react-device-detect'
import { toast } from 'sonner'
import useSound from 'use-sound'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { TransferTonButton } from '../transfer-ton-button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'
import { RadioGroup, RadioGroupItem } from './radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { useShop, type TShopItem } from '@/hooks/api/use-shop'
import { useTranslation } from 'react-i18next'

export function DrawerTime({
  className,
  children,
  asChild,
}: {
  className?: string
  children: React.ReactNode
  asChild?: boolean
}) {
  const {t} = useTranslation();
  // const [isOpen, setIsOpen] = useState<boolean>(false)
  // const { accountQuery } = useAccountMe()
  const [radioValue, setRadioValue] = useState('1 week')
  const amount = useMemo(() => {
    if (radioValue === '1 day') return ITEM_TIME_1D_PRICE
    if (radioValue === '1 week') return ITEM_TIME_1W_PRICE
    if (radioValue === '1 month') return ITEM_TIME_1M_PRICE
    if (radioValue === '1 year') return ITEM_TIME_1Y_PRICE
  }, [radioValue])
  const itemName = useMemo(() => {
    if (radioValue === '1 day') return 'time'
    if (radioValue === '1 week') return 'time_one_week'
    if (radioValue === '1 month') return 'time_one_month'
    if (radioValue === '1 year') return 'time_one_year'
  }, [radioValue])
  // const { user } = useAccount()
  const [play, { stop }] = useSound('/sounds/Button.aac')
  const { buyItem } = useShop();

  const [buyTimeProgress, setBuyTimeProgress] = useState(false)
  const buyTimeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const previousAccountTimeRef = useRef<number | null>(null)

  useEffect(() => {
    return () => stop()
  }, [play])

  useEffect(() => {
    return () => {
      if (buyTimeIntervalRef.current) {
        clearInterval(buyTimeIntervalRef.current)
        buyTimeIntervalRef.current = null
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
      key="item-time"
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
        className="bg-[#161714] rounded-t-[32px]! border-t-2 border-[#2f302e] pt-3"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
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
          <DrawerTitle className="font-pixel text-white text-2xl uppercase">
            {t('shop-page.items.time.card.title')}
          </DrawerTitle>
          <DrawerDescription className="text-white/60 font-inter text-sm">
            {t('shop-page.items.time.card.description')}
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
            src="/shop/clock.webp"
            alt="time"
            className="absolute left-1/2 -translate-x-1/2 w-[126px] h-auto top-0"
          />
        </div>

        <RadioGroup
          defaultValue="1 month"
          value={radioValue}
          onValueChange={(value) => {
            play()
            setRadioValue(value)
          }}
          className="flex gap-3 justify-center mb-5 mt-40 relative"
        >
          {[`1 week`, '1 month', '1 year'].map((option) => (
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
                1 {
                  t(`timer-parts.${option.split(' ')[1] || option}`)
                }
              </label>
            </div>
          ))}
        </RadioGroup>

        <div className="relative inline-flex justify-around items-center w-full">
          <div className="font-pixel flex flex-col gap-1 w-[98px]">
            <span className="text-[#B6FF00] text-3xl text-center relative bottom-2">
              +1
            </span>
            <span className="text-white/40 text-xs text-center uppercase">
              {radioValue === '1 week'
                ? t('timer-parts.week')
                : radioValue === '1 month'
                  ? t('timer-parts.month')
                  : t('timer-parts.year')}
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
            disabled={buyTimeProgress}
            recipient={RECEIVER_ADDRESS}
            amount={amount ?? 0.5}
            // comment={`nymb.shop?type=${itemName}&telegramId=${user?.id}`}
            className="py-3 w-full inline-flex justify-center items-center gap-1 uppercase"
            onTransferSuccess={async (hash) => {
              // setBuyTimeProgress(true)

              // previousAccountTimeRef.current = accountQuery.data?.time ?? null

              // if (buyTimeIntervalRef.current) {
              //   clearInterval(buyTimeIntervalRef.current)
              //   buyTimeIntervalRef.current = null
              // }

              // const id = setInterval(async () => {
              //   const res = await accountQuery.refetch()
              //   const previousTime = previousAccountTimeRef.current
              //   const nextTime = res.data?.time

              //   if (
              //     typeof nextTime === 'number' &&
              //     (previousTime == null || nextTime > previousTime)
              //   ) {
              //     clearInterval(id)
              //     buyTimeIntervalRef.current = null
              //     previousAccountTimeRef.current = null
              //     setBuyTimeProgress(false)
              //     // toast.success('Time purchased')
              //   }
              // }, 2000)

              // buyTimeIntervalRef.current = id

              await buyItem(itemName as TShopItem, hash)
            }}
            onConnect={() => {
              setIsOpen(false)
            }}
            onError={(e) => {
              setBuyTimeProgress(false)
              previousAccountTimeRef.current = null
              if (buyTimeIntervalRef.current) {
                clearInterval(buyTimeIntervalRef.current)
                buyTimeIntervalRef.current = null
              }
              if (e.message === 'Insufficient balance') {
                toast.error('Insufficient balance')
              } else {
                toast.error('An error occurred during payment')
              }
            }}
          >
            {buyTimeProgress ? (
              'Waiting...'
            ) : (
              <>
                {t('shop-page.items.time.card.button.buy.0')} <TonIcon fill="black" />
                {amount} {t('shop-page.items.time.card.button.buy.1', { amount, value: radioValue })}
              </>
            )}
          </TransferTonButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
