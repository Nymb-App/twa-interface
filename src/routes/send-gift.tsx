import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { shareURL } from '@telegram-apps/sdk'
import { useRive } from '@rive-app/react-canvas'
import { PageLayout } from '@/components/ui/page-layout'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { cn, convertGiftValueToSeconds } from '@/utils'
// import { SendGift } from '@/assets/icons/send-gift'
import { RussianRoulette } from '@/components/ui/russian-roullete'
import { GiftSelector } from '@/components/frens-page/gift-selector'
import { SendGiftButton } from '@/components/frens-page/gift-button'
import { ActionButton } from '@/components/ui/action-button'
import { useReferrals } from '@/hooks/api/use-referrals'
import { ElectricLines } from '@/components/ui/electric-lines'

export const Route = createFileRoute('/send-gift')({
  component: RouteComponent,
})

function RouteComponent() {
  const [giftValue, setGiftValue] = useState(24)
  const [giftUnits, setGiftUnits] = useState('weeks')

  const [isStartRoulette, setIsStartRoulette] = useState(false)
  const [isFinishRoulette, setIsFinishRoulette] = useState(false)

  const { sendGiftToFriend, myReferrals } = useReferrals()

  const [referralsNickName, setReferralsNickName] = useState<Array<string>>([])
  const [referralsPhotoUrl, setReferralsPhotoUrl] = useState<Array<string>>([])

  const winnerIndex = Math.floor(Math.random() * referralsNickName.length)

  const [isRiveAnimationEnd, setIsRiveAnimationEnd] = useState(false)

  useEffect(() => {
    if (isFinishRoulette) {
      const riveAnimationTimer = setTimeout(() => {
        setIsRiveAnimationEnd(true)
      }, 5000)
      return () => clearTimeout(riveAnimationTimer)
    }
  }, [isFinishRoulette])

  useEffect(() => {
    if (myReferrals) {
      setReferralsNickName(
        myReferrals.referrals.map((referral) => referral.nickname),
      )
      setReferralsPhotoUrl(
        myReferrals.referrals.map((referral) => referral.photoUrl),
      )
    }
  }, [myReferrals])

  const { rive, RiveComponent } = useRive({
    src: '/riveAnimations/gift-freinds2.riv',
    autoplay: false,
  })

  return (
    <PageLayout className="bg-[#151317]" useFooter={false}>
      <header className="flex flex-col items-center relative">
        <FlickeringGrid
          className="absolute inset-0 h-[350px] mask-[radial-gradient(ellipse_250px_250px_at_center,black,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#aa73f9"
          maxOpacity={1}
          flickerChance={0.3}
          autoResize={false}
          width={450}
          height={350}
        />
        <h1 className="font-pixel font-[400] text-center text-[24px] leading-[32px] uppercase mb-[115px]">
          {!isStartRoulette ? (
            <>
              enter the
              <br />
              prize amount
            </>
          ) : (
            <>
              send a gift
              <br />
              to fren
            </>
          )}
        </h1>
        <RiveComponent
          className={cn(
            'pointer-events-none size-126 absolute top-[-94px] z-1 left-[51%] -translate-x-1/2 rotate-[15deg]',
            !isFinishRoulette && 'animate-[wiggle_3s_ease-in-out_infinite]',
            isFinishRoulette &&
              'delay-2000 transition-all duration-5000 opacity-0',
          )}
        />
        <div
          className={cn(
            'opacity-0 transition-all duration-1500 font-400 text-center -mt-[40px] absolute top-[145px]',
            isRiveAnimationEnd && 'opacity-100',
          )}
        >
          <span
            className={cn(
              'font-pixel text-[64px] leading-[120%] [text-shadow:0px_0px_60px_#A55EFF] bg-gradient-to-b from-[#BE8CFF] to-[#8C35FB] bg-clip-text text-transparent',
              String(giftValue).startsWith('1') && 'mr-6',
            )}
          >
            {giftValue}
          </span>
          <p className="font-pixel text-[20px] leading-[24px] mt-2 uppercase">
            {giftUnits} gets
          </p>
          {isRiveAnimationEnd && (
            <ElectricLines
              svg1ClassName="top-[-120px] left-[180px]"
              svg2ClassName="top-[-80px] left-[-30px]"
              svg3ClassName="top-[30px] left-[-40px]"
              svg4ClassName="top-[70px]"
            />
          )}
        </div>
      </header>

      {!isStartRoulette ? (
        <div className="px-4 mt-16">
          <GiftSelector
            value={giftValue}
            unit={giftUnits}
            onValueChange={(value) => {
              setGiftValue(value)
            }}
            onUnitChange={(units) => {
              setGiftUnits(units)
            }}
          />
        </div>
      ) : (
        <div className="px-4 mt-32">
          <RussianRoulette
            userNames={referralsNickName}
            isStartRoulette={isStartRoulette}
            items={referralsNickName.map((_, index) => (
              <AvatarCard
                key={index}
                src={referralsPhotoUrl[index]}
                label={''}
              />
            ))}
            // riveAnimation={riveGift || undefined}
            winnerIndex={winnerIndex}
            duration={30000}
            gap={50}
            loops={12}
            onFinish={() => {
              setIsFinishRoulette(true)
              sendGiftToFriend.mutate({
                friendId: Number(
                  myReferrals?.referrals[winnerIndex].telegramId,
                ),
                time: convertGiftValueToSeconds(giftValue, giftUnits),
              })
              if (rive) rive.play()
            }}
          />
        </div>
      )}

      {!isStartRoulette && (
        <SendGiftButton
          value={giftValue}
          unit={giftUnits}
          onClick={() => setIsStartRoulette(true)}
        />
      )}
      {isFinishRoulette && (
        <div className="fixed w-full bottom-0 flex flex-col gap-2 px-4 mb-6 max-w-[450px]">
          <ActionButton
            onClick={() => {
              const telegramLink =
                import.meta.env.VITE_TELEGRAM_APP_LINK ||
                'https://telegram-apps.com'
              if (shareURL.isAvailable()) {
                shareURL(telegramLink, 'Check out this cool app!')
              }
            }}
            className="text-black active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed"
          >
            Share and get +2 hour
          </ActionButton>

          <Link to="/frens">
            <ActionButton
              // onClick={() => setIsShowSendGiftActionButtons?.(false)}
              className="bg-gradient-to-b from-[#FFFFFF] to-[#999999]"
            >
              <span className="font-pixel text-[#121312] font-[400] uppercase text-[18px] leading-[24px]">
                close
              </span>
            </ActionButton>
          </Link>
        </div>
      )}
    </PageLayout>
  )
}

export const AvatarCard = ({
  src,
  label,
  className,
  classNameForSpan,
  classNameForImg,
}: {
  src: string
  label: string
  className?: string
  classNameForSpan?: string
  classNameForImg?: string
}) => (
  <div
    className={cn('relative size-22 rounded-full overflow-hidden', className)}
  >
    <img
      src={src}
      className={cn('size-full object-cover shadow-lg', classNameForImg)} // ← ОДИНАКОВО для всех
    />
    <span
      className={cn(
        'absolute left-1/2 top-1/2 -translate-1/2 font-pixel text-2xl',
        classNameForSpan,
      )}
    >
      {label || ''}
    </span>
  </div>
)
