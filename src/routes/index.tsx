import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { isAndroid, isIOS } from 'react-device-detect'

import { TelegramStarIcon } from '@/assets/icons/telegram-star'
import { TonIcon } from '@/assets/icons/ton'
import { AnimationStartOverlay } from '@/components/animation-start-overlay'
import FrostScratchPanel from '@/components/frost-scratch-panel'
import { FarmingButton } from '@/components/home-page/button-farming'
import { ProgressSection } from '@/components/home-page/progress-section'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { ScratchHint } from '@/components/scratch-hint'
import { StarsCard } from '@/components/stars-card'
import { TransferTonButton } from '@/components/transfer-ton-button'
import { CardContent } from '@/components/ui/card-content'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from '@/components/ui/drawer'
import { PageLayout } from '@/components/ui/page-layout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AppContext } from '@/context/app-context'
import { useAccountMe } from '@/hooks/api/use-account'
import { useAuth } from '@/hooks/api/use-api'
import { useShop } from '@/hooks/api/use-shop'
import { useCheckIn } from '@/hooks/use-get-daily-rewards'
import { RECEIVER_ADDRESS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Snowfall from 'react-snowfall'
import { toast } from 'sonner'
import useSound from 'use-sound'
import { SwipeCard } from '@/components/swipe-card'
import { GameCard } from '@/components/game-card'
import { BattleCard } from '@/components/battle-card'


const HomeComponent = memo(function HomeComponent() {
  const [isClaimStart, setIsClaimStart] = useState(false)
  const [revealed, setRevealed] = useState<boolean>(false)
  const [isPurchaseSuccess, setPurchaseSuccess] = useState<boolean>(false)

  // Animation start overlay
  const { isGameStarted, setIsGameStarted } = useContext(AppContext)
  const [isAppStarted, setAppStarted] = useState<boolean>(false)
  const [isAnimationCountdownFinished, setAnimationCountdownFinished] =
    useState<boolean>(false)
  const [
    isAnimationCountdownCooldownFinished,
    setAnimationCountdownCooldownFinished,
  ] = useState<boolean>(false)
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) return
    ;(async () => {
      await login()
    })()
  }, [login, isAuthenticated])

  const { dailyRewardsQuery } = useCheckIn()
  const { accountQuery } = useAccountMe()
  const { buyItem } = useShop()

  const [play] = useSound('/sounds/Button.aac')

  const router = useRouter()
  const { isGetCheckInReward, isOnboardingCompleted } = useContext(AppContext)

  const accountTime = useMemo(() => {
    if (!accountQuery.data || !accountQuery.data.time) return 0
    return accountQuery.data.time * 1000
  }, [accountQuery.data])

  const handleClaimClick = useCallback(() => {
    setIsClaimStart(true)
  }, [])

  useEffect(() => {
    if (isGameStarted) return
    if (!isAppStarted) return
    const timerId0 = setTimeout(() => {
      setAnimationCountdownFinished(true)
    }, 5000)
    const timerId1 = setTimeout(() => {
      setAnimationCountdownCooldownFinished(true)
      setIsGameStarted(true)
    }, 7000)

    return () => {
      clearTimeout(timerId0)
      clearTimeout(timerId1)
    }
  }, [isAppStarted, isGameStarted])

  console.log(isGameStarted)

  useEffect(() => {
    const now = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    )

    const todayInSeconds = Math.floor(now.getTime() / 1000)

    if (
      accountQuery.data &&
      !accountQuery.data.isFinishOnboarding &&
      !isOnboardingCompleted
    )
      router.navigate({ to: '/onboarding' })

    if (
      dailyRewardsQuery.data?.nextAvailableAt &&
      dailyRewardsQuery.data.nextAvailableAt === todayInSeconds &&
      accountTime >= Date.now() &&
      !isGetCheckInReward
    ) {
      router.navigate({ to: '/check-in' })
    }
  }, [dailyRewardsQuery, router, accountTime, isGetCheckInReward])

  // useEffect(() => {
  //   return () => stop()
  // }, [play])

  return (
    <PageLayout className="top-0 mb-7">
      {
        <>
          {!isAppStarted && !isGameStarted && (
            <AnimationStartOverlay
              className="fixed w-full z-60"
              onStart={() => setAppStarted(true)}
            />
          )}

          {isAppStarted &&
            !isGameStarted &&
            !isAnimationCountdownCooldownFinished && (
              <div
                className={cn(
                  'fixed size-full z-60 bg-[#121312] left-0 transition-all',
                  isAnimationCountdownFinished && 'duration-800 opacity-0',
                )}
              >
                <div
                  className={cn(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#121312_95%)] duration-500',
                    // isAnimationCountdownFinished && 'h-[300px]'
                  )}
                />
                <div
                  className={cn(
                    'absolute size-full duration-700 overflow-clip',
                    isAnimationCountdownFinished && 'h-[250px]',
                  )}
                >
                  <FlickeringGrid
                    className="absolute inset-0 z-0 size-full left-3"
                    squareSize={2}
                    gridGap={12}
                    color="#b7ff01"
                    maxOpacity={0.5}
                    flickerChance={0.3}
                    autoResize={!isAnimationCountdownFinished}
                    // width={450}
                  />

                  <div className="absolute size-full bg-linear-to-b from-transparent from-50% to-[#121312]" />
                  <div className="absolute size-full bg-linear-to-b from-[#121312] to-transparent to-50%" />
                  <div className="absolute size-full bg-[radial-gradient(ellipse_at_center,transparent_50%,#121312_95%)]" />
                  <iframe
                    className={cn(
                      'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] border-none outline-none duration-700',
                      isAnimationCountdownFinished && 'scale-75',
                    )}
                    src="https://rive.app/s/kxIqyPB440W_N6jMnHDnCw/embed?runtime=rive-renderer&fit=cover"
                  />
                </div>
              </div>
            )}
        </>
      }
      {!accountQuery.isLoading && accountTime < Date.now() && (
        <>
          {!revealed && (
            <>
              <FrostScratchPanel
                backgroundImage="/frozen-account-bg.jpg" // картинка рисуется ВНУТРИ canvas и стирается
                backgroundFit="cover"
                backgroundPosition="center"
                className="fixed w-full max-w-[450px] min-h-screen z-1000"
                revealThreshold={0.2}
                brushRadius={34}
                brushHardness={0.5}
                eraseStrength={1}
                tintColor="#000"
                tintOpacity={0}
                onReveal={() => setRevealed(true)}
              />
              <Snowfall
                style={{
                  zIndex: 100000,
                }}
                wind={[-0.5, 1]}
                snowflakeCount={20}
                radius={[1, 1.5]}
              />
              <ScratchHint
                variant="swipe"
                top="70%"
                left="55%"
                color="#95D9EF"
              />
            </>
          )}

          <UnfreezeAccountDrawer
            value={2.5}
            open={revealed && !isPurchaseSuccess ? true : false}
            onOpenChange={(open) => {
              if (open === false && !isPurchaseSuccess) {
                setRevealed(false)
              }
            }}
            onSuccess={async (hash) => {
              toast.success('Time restored')
              await buyItem('time', hash)
              setPurchaseSuccess(true)
            }}
          />
        </>
      )}
      <div className="h-24" />

      <ProgressSection isClaimStart={isClaimStart} />
      <div className="mt-5 px-4">
        <StarsCard
          linkTo="/giveaway"
          isPageLink={true}
          actionTitle="JOIN IN"
          className="mt-5 mb-2"
          classNameStar0="size-[58px] mr-3"
          classNameStar1="size-[75px]"
          classNameStar2="size-[58px] ml-3"
          classNameTitle="mt-8 text-5xl"
          classNameDescription1="hidden"
        />
        <div className="grid grid-cols-2 gap-2">
          <Link
            onClick={() => play()}
            to="/minigames/slide"
            disabled={accountTime < Date.now()}
          >
            {isAndroid ? (
              <>
                  <SwipeCard
                    className="font-pixel w-full font-normal"
                    classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
                    title="Swipes"
                    description={"let's see how you react"}
                  />
              </>
            ) : (
                <GameCard
                  delay={1000}
                  placeholderSrc="/lottie-placeholder/minigames/slide.webp"
                  className="font-pixel w-full font-[400]"
                  classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[130%] -top-[50%] opacity-20"
                  title="Swipes"
                  description={"let's see how you react"}
                  animationData={'/lottie/main.json'}
                />
            )}
          </Link>

          <Link
            onClick={() => play()}
            to="/minigames/battle"
            search={{
              bet: undefined as unknown as number,
              invitedBy: undefined as unknown as number,
            }}
            disabled={accountTime < Date.now()}
          >
              <BattleCard
                className="font-pixel w-full"
                classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(133,_59,_241,_1)_15%,_rgba(133,_59,_241,_0.9)_30%,_rgba(133,_59,_241,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
                title="Battle"
                description="are you strong enough?"
              />
          </Link>
        </div>
        <div className="mt-2 mb-[26px] grid grid-cols-2 gap-2">
          <Link onClick={() => play()} to="/shop">
            <CardContent />
          </Link>
          <CardContent isLocked />
        </div>
        <FarmingButton
          onClick={handleClaimClick}
          className="fixed bottom-23 w-[calc(100%-32px)] max-w-[420px] disabled:cursor-not-allowed disabled:from-white disabled:to-[#999999]"
          disabled={accountTime < Date.now()}
        />
      </div>
    </PageLayout>
  )
})

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function UnfreezeAccountDrawer({
  value,
  open,
  onOpenChange,
  onSuccess,
  onError,
}: {
  value: number
  open: boolean
  onOpenChange?: (_open: boolean) => void
  onSuccess?: (hash: string) => void
  onError?: (e: any) => void
}) {
  // const [isOpen, setIsOpen] = useState<boolean>(open)
  const [isOpen] = useState<boolean>(open)

  const scrollYRef = useRef(0)
  const closeUnlockTimerRef = useRef<number | null>(null)

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
  }, [isOpen, open])

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
      <DrawerContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3"
      >
        <DrawerTitle className="sr-only"></DrawerTitle>
        <DrawerDescription className="sr-only"></DrawerDescription>
        <DrawerClose className="absolute top-3 right-3 bg-[#1D1F1D] size-8 rounded-full flex justify-center items-center cursor-pointer">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.29289 0.292893C8.68342 -0.0976311 9.31643 -0.0976311 9.70696 0.292893C10.0975 0.683417 10.0975 1.31643 9.70696 1.70696L6.41399 4.99992L9.70696 8.29289L9.77532 8.36907C10.0957 8.76184 10.0731 9.34084 9.70696 9.70696C9.34084 10.0731 8.76184 10.0957 8.36907 9.77532L8.29289 9.70696L4.99992 6.41399L1.70696 9.70696L1.63078 9.77532C1.23801 10.0957 0.659009 10.0731 0.292893 9.70696C-0.0732229 9.34084 -0.0958169 8.76184 0.224534 8.36907L0.292893 8.29289L3.58586 4.99992L0.292893 1.70696C-0.097631 1.31643 -0.097631 0.683417 0.292893 0.292893C0.683417 -0.097631 1.31643 -0.097631 1.70696 0.292893L4.99992 3.58586L8.29289 0.292893Z"
              fill="white"
            />
          </svg>
        </DrawerClose>

        <img
          src="/index-page/dotted-pattern.png"
          alt="Dotted Pattern"
          className="w-full h-auto select-none pointer-events-none absolute"
        />
        <img
          src="/unfreeze-drawer-timer.webp"
          alt="Battle Card Top"
          className="absolute top-0 left-1/2 mt-10 -translate-x-1/2 w-full max-w-[70%] h-auto select-none pointer-events-none"
        />

        <div className="p-4 mt-50">
          <h3 className="font-pixel text-3xl text-white text-center uppercase">
            {/* get <span className="text-[#B6FF00]">3 days,</span> */}
            {/* <br /> */}
            <span className="text-[#B6FF00]">Unfreeze</span> your
            <br />
            account
          </h3>
          <p className="text-white/60 font-inter text-sm text-center mt-2">
            Swipe every day to build your time bank.
            <br />
            Skip bombs, grab multipliers, win big!
          </p>
        </div>
        <div className="font-pixel inline-flex items-center justify-center gap-5 w-full mt-3 mb-2">
          <span className="text-white text-3xl text-center">{value}</span>
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
        <DrawerFooter className="w-full px-5 mb-3">
          <TransferTonButton
            recipient={RECEIVER_ADDRESS}
            amount={value}
            className="py-4 w-full inline-flex justify-center items-center gap-1"
            onTransferSuccess={onSuccess}
            onError={(e) => {
              onError?.(e)
              if (e.message === 'Insufficient balance') {
                toast.error('Insufficient balance')
              } else {
                toast.error('An error occurred during payment')
              }
            }}
          >
            UNFREEZE <TonIcon fill="black" className="size-6" /> {value} TON
          </TransferTonButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
