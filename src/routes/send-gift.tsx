import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PageLayout } from '@/components/ui/page-layout'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { cn } from '@/utils'
import { SendGift } from '@/assets/icons/send-gift'
import { RussianRoulette } from '@/components/ui/russian-roullete';
import { GiftSelector } from '@/components/pages/friends/gift-selector'
import { SendGiftButton } from '@/components/pages/friends/gift-button'


export const Route = createFileRoute('/send-gift')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.body.style.backgroundColor = '#151317'
    return () => {
      document.body.style.backgroundColor = '#121312'
    }
  }, [])

  const [giftValue, setGiftValue] = useState(24);
  const [giftUnits, setGiftUnits] = useState('weeks');

  const [isStartRoulette, setIsStartRoulette] = useState(false)

  return (
    <PageLayout
      className="bg-[#151317]"
      useFooter={false}
    >
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
          {!isStartRoulette ?
            <>
              enter the<br />
              prize amount
            </>
          :
          <>
            send a gift<br />
            to fren
          </>
          }
        </h1>
        <SendGift className="animate-[wiggle_3s_ease-in-out_infinite] absolute top-[60px] z-1" />
      </header>

      {!isStartRoulette 
      ? (
        <div className='px-4 mt-16'>
          <GiftSelector
            value={giftValue}
            unit={giftUnits}
            onValueChange={(value) => {
              setGiftValue(value)
            }}
            onUnitChange={(units) => {
              setGiftUnits(units);
            }}
          />
        </div>
      ) : (
        <div className='px-4 mt-32'>
          <RussianRoulette
            isStartRoulette={isStartRoulette}
            items={participants}
            winnerIndex={3}
            duration={12500}
            gap={50}
            loops={4}
            onFinish={() => {console.log('finish')}}
          />
        </div>
      )
      }

      {!isStartRoulette && (
        <SendGiftButton
          value={giftValue}
          unit={giftUnits}
          onClick={() => setIsStartRoulette(true)}
        />
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
      {label || 'NA'}
    </span>
  </div>
)

const participants = [
  <AvatarCard src="/roulette-icons/user-1.png" label="IM" />,
  <AvatarCard src="/roulette-icons/user-2.png" label="AJ" />,
  <AvatarCard src="/roulette-icons/user-3.png" label="MP" />,
  <AvatarCard src="/roulette-icons/user-2.png" label="JS" />,
]
