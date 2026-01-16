import { GiftSelector } from '@/components/frens-page/gift-selector'
import { SendGiftButton } from '@/components/frens-page/ui/gift-button'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { ActionButton } from '@/components/ui/action-button'
import { Button } from '@/components/ui/button'
import { ElectricLines } from '@/components/ui/electric-lines'
import { PageLayout } from '@/components/ui/page-layout'
import { RussianRoulette } from '@/components/ui/russian-roullete'
import { useAccountMe } from '@/hooks/api/use-account'
import { useReferrals } from '@/hooks/api/use-referrals'
import { ADSGRAM_APP_ID } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { convertGiftValueToSeconds } from '@/utils'
import { useAdsgram } from '@adsgram/react'
import { useRive } from '@rive-app/react-canvas'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSound from 'use-sound'

export const Route = createFileRoute('/send-gift')({
  component: RouteComponent,
})

function RouteComponent() {
  const [giftValue, setGiftValue] = useState(24)
  const [giftUnits, setGiftUnits] = useState('weeks')
  const [daysLeftCount, setDaysLeftCount] = useState(0)

  const [isStartRoulette, setIsStartRoulette] = useState(false)
  const [isFinishRoulette, setIsFinishRoulette] = useState(false)
  const [disableAdsButton, setDisableAdsButton] = useState(false)

  const { sendGiftToFriend, myReferrals } = useReferrals()

  const [referralsNickName, setReferralsNickName] = useState<Array<string>>([])
  const [referralsPhotoUrl, setReferralsPhotoUrl] = useState<Array<string>>([])
  const winnerIndex = Math.floor(Math.random() * referralsNickName.length)
  const [isRiveAnimationEnd, setIsRiveAnimationEnd] = useState(false)
  const { accountQuery } = useAccountMe()

  const [play, { stop }] = useSound('/sounds/Button.aac')
  const [playGift, { stop: stopPlayGift }] = useSound('/sounds/Swipe-End.aac')
  const [playGiftOpening, { stop: stopPlayGiftOpening }] = useSound(
    '/sounds/Farm-End.aac',
  )
  const [playRouletteStart, { stop: stopPlayRouletteStart }] = useSound(
    '/sounds/Snap.aac',
    {
      volume: 0.5,
    },
  )


  const handleError = useCallback((): void => {
    console.error('Task error')
  }, [])

  const handleReward = useCallback(() => {
    sendGiftToFriend.mutate({
      friendId: Number(
        myReferrals?.referrals[winnerIndex].telegramId,
      ),
      time: 7200,
    })
    setDisableAdsButton(true);
  }, [])


  const adsConfig = useMemo(
    () => ({
      blockId: ADSGRAM_APP_ID,
      debug: false,
      onReward: handleReward,
      onError: handleError,
    }),
    [handleReward, handleError],
  )

  const { show } = useAdsgram(adsConfig)

  useEffect(() => {
    if (!accountQuery.data) return
    const secondsLeft = accountQuery.data.time || 0
    const daysLeft = Math.floor(
      Math.abs(secondsLeft * 1000 - Date.now()) / 86400000,
    )
    setDaysLeftCount(daysLeft)
    setGiftValue(daysLeft > 24 ? 24 : daysLeft)
    if (daysLeft >= 7) {
      setGiftUnits('weeks')
    } else {
      setGiftUnits('days')
    }
  }, [accountQuery.data?.time])

  useEffect(() => {
    if (isFinishRoulette) {
      playGift()
      const giftOpeningSoundTimer = setTimeout(() => {
        playGiftOpening()
      }, 3000)
      const riveAnimationTimer = setTimeout(() => {
        setIsRiveAnimationEnd(true)
      }, 5000)
      return () => {
        clearTimeout(giftOpeningSoundTimer)
        clearTimeout(riveAnimationTimer)

        stopPlayGiftOpening()
        stopPlayGift()
        stopPlayRouletteStart()
      }
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

  useEffect(() => {
    return () => stop()
  }, [play])

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
        <h1 className="font-pixel font-normal text-center text-[24px] leading-[32px] uppercase mb-[115px]">
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
            maxValue={daysLeftCount}
            maxDays={daysLeftCount}
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
            winnerIndex={winnerIndex}
            duration={30000}
            gap={50}
            loops={12}
            onChange={() => {
              playRouletteStart()
            }}
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
          onClick={() => {
            play()
            setIsStartRoulette(true)
          }}
        />
      )}
      {isFinishRoulette && (
        <div className="fixed w-full bottom-0 flex flex-col gap-2 px-4 mb-6 max-w-[450px]">
          {/* <ShareButton time={7200} /> */}
          <Button
            variant={'nymb-green'}
            disabled={disableAdsButton}
            onClick={() => {
              show();
            }}
            className="relative h-[54px] text-black from-[#ADFA4B] to-[#B6FF00] active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed"
          >
            GET +2H REWARD

            <AdsLabelSvg
              className='absolute  top-2 right-2'
              labelColor='black'
              labelOpacity={1}
            />
          </Button>

          <Link
            onClick={() => {
              play()
            }}
            to="/frens"
          >
            <ActionButton className="bg-linear-to-b from-[#FFFFFF] to-[#999999]">
              <span className="font-pixel text-[#121312] font-normal uppercase text-[18px] leading-[24px]">
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



const AdsLabelSvg = ({
  labelOpacity,
  labelColor,
  className,
}: {
  labelOpacity?: number
  labelColor?: string
  className?: string
}) => {
  return (
    <svg
      className={cn(className)}
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={labelOpacity || '0.5'}>
        <path
          d="M22 2H20V4H22V2H24V16H22V14H20V16H22V18H2V16H4V14H2V16H0V2H2V4H4V2H2V0H22V2ZM8 5V6H7V8H6V11H5V13H7V12H8V11H10V12H11V13H13V11H12V8H11V6H10V5H8ZM14 5V13H18V12H19V11H20V7H19V6H18V5H14ZM17 7V8H18V10H17V11H16V7H17ZM10 8V9H8V8H10Z"
          fill={labelColor || 'white'}
        />
      </g>
    </svg>
  )
}