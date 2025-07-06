import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { shareURL } from '@telegram-apps/sdk'
import { useRive } from '@rive-app/react-canvas'
import { PageLayout } from '@/components/ui/page-layout'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { cn } from '@/utils'
// import { SendGift } from '@/assets/icons/send-gift'
import { RussianRoulette } from '@/components/ui/russian-roullete'
import { GiftSelector } from '@/components/frens-page/gift-selector'
import { SendGiftButton } from '@/components/frens-page/gift-button'
import { ActionButton } from '@/components/ui/action-button'
import { useReferrals } from '@/hooks/api/use-referrals'

export const Route = createFileRoute('/send-gift')({
  component: RouteComponent,
})

const convertGiftValueToSeconds = (value: number, unit: string) => {
  switch (unit) {
    case 'weeks':
      return value * 60 * 60 * 24 * 7
    case 'days':
      return value * 60 * 60 * 24
    case 'hours':
      return value * 60 * 60
    case 'minutes':
      return value * 60
    case 'seconds':
      return value
    default:
      return value
  }
}

function RouteComponent() {
  const [giftValue, setGiftValue] = useState(24)
  const [giftUnits, setGiftUnits] = useState('weeks')

  const [isStartRoulette, setIsStartRoulette] = useState(false)
  const [isFinishRoulette, setIsFinishRoulette] = useState(false)

  const { sendGiftToFriend, myReferrals } = useReferrals()

  const [referralsNickName, setReferralsNickName] = useState<Array<string>>([])
  const [referralsPhotoUrl, setReferralsPhotoUrl] = useState<Array<string>>([])

  const winnerIndex = Math.floor(Math.random() * referralsNickName.length)

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
        <RiveComponent className="size-126 absolute top-[-104px] z-1 animate-[wiggle_3s_ease-in-out_infinite] left-[51%] -translate-x-1/2 rotate-[15deg]" />
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
            items={referralsNickName.map((nickname, index) => (
              <AvatarCard
                classNameForSpan="mix-blend-difference"
                key={index}
                src={referralsPhotoUrl[index]}
                label={''}
              />
            ))}
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
