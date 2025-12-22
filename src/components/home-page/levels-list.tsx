import { useAccountMe } from '@/hooks/api/use-account'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import Marquee from 'react-fast-marquee'
import useSound from 'use-sound'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'

export const LevelsList = () => {
  const levelsArray = Array.from({ length: 12 }, (_, idx) => idx + 1).reverse()
  const [play] = useSound('/sounds/Button.aac')

  const { getLvlStats } = useAccountMe()

  const currentLvl = useMemo(
    () => getLvlStats.data?.currentLevel ?? 12,
    [getLvlStats],
  )

  const isNextLvlUnlocked = useMemo(
    () => getLvlStats.data?.isNextLvlUnlocked ?? false,
    [getLvlStats],
  )

  const getLevelStatus = (
    level: number,
    currentLevel: number,
    isNextUnlocked: boolean,
  ): 'locked' | 'unlocked' | 'pending' => {
    if (level >= currentLevel) {
      return 'unlocked'
    }
    if (level === currentLevel - 1 && isNextUnlocked) {
      return 'pending'
    }
    return 'locked'
  }

  return (
    <div className="relative -mt-[10px] w-full">
      <div className="pointer-events-none absolute inset-y-0 top-[10px] -right-10 z-20 h-[70px] w-full bg-linear-to-l from-[#121312] via-transparent via-40% to-transparent to-95%" />
      <div className="pointer-events-none absolute inset-y-0 top-[10px] -left-10 z-20 h-[70px] w-full bg-linear-to-r from-[#121312] via-transparent via-40% to-transparent to-95%" />
      <div className="absolute top-[10px] left-1/2 z-0 -translate-x-1/2">
        <FlickeringGrid
          className="mask-[radial-gradient(140px_circle_at_center,white,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#b7ff01"
          maxOpacity={0.5}
          flickerChance={0.3}
          autoResize={false}
          width={500}
          height={120}
        />
      </div>
      <Link onClick={() => play()} to="/gate">
        <Carousel
          className="relative z-10 h-[90px]"
          opts={{
            align: 'center',
            slidesToScroll: 4,
            startIndex: Math.max(
              0,
              Math.round((levelsArray.indexOf(currentLvl) - 1) / 4),
            ),
          }}
        >
          <CarouselContent>
            <MarqueeArrows />
            {levelsArray.map((_, idx) => {
              const lvl = 12 - idx
              return (
                <CarouselLvlItem
                  key={idx}
                  lvl={lvl}
                  status={getLevelStatus(lvl, currentLvl, isNextLvlUnlocked)}
                />
              )
            })}
          </CarouselContent>
        </Carousel>
      </Link>
    </div>
  )
}

export const CarouselLvlItem = ({
  lvl,
  status,
}: {
  lvl: number
  status: 'locked' | 'unlocked' | 'pending'
}) => {
  return (
    <CarouselItem className="relative flex h-[106px] basis-1/4 items-center justify-center">
      {status === 'unlocked' && (
        <div className="flex justify-center h-[48px] w-[48px] rounded-[18px] border border-[#FFFFFF1F] bg-[#161816] shadow-none">
          <span
            className={cn(
              String(lvl).startsWith('1') && 'mr-1.5',
              'leading-[47px]',
            )}
          >
            {lvl}
          </span>
        </div>
      )}
      {status === 'pending' && (
        <div className="inline-flex size-[32px] items-center justify-center rounded-[12px] bg-[#121312] border border-[#B6FF00] text-[#B6FF00] shadow-[0px_0px_20px_rgba(182,255,0,0.4)]">
          <span className={cn(String(lvl).startsWith('1') && 'mr-1.5')}>
            {lvl}
          </span>
        </div>
      )}
      {status === 'locked' && (
        <div className="flex justify-center">
          <span className="inline-flex h-[32px] w-[32px] rounded-[12px] border border-[#FFFFFF1F] bg-[#161816] p-2.5 text-[16px] leading-[20px] font-[400]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.52958 4.23525V3.5295C9.52958 1.5825 7.94633 0 6.00008 0C4.05383 0 2.47058 1.58325 2.47058 3.5295V4.23525C1.69058 4.23525 1.05908 4.8675 1.05908 5.64675V10.5885C1.05908 11.3685 1.69058 12 2.47058 12H9.52958C10.3096 12 10.9411 11.3678 10.9411 10.5885V5.64675C10.9411 4.86675 10.3088 4.23525 9.52958 4.23525ZM3.88208 3.5295C3.88208 2.36175 4.83233 1.4115 6.00008 1.4115C7.16783 1.4115 8.11808 2.36175 8.11808 3.5295V4.23525H3.88133L3.88208 3.5295ZM6.70583 8.4705C6.70583 8.65768 6.63148 8.83719 6.49912 8.96954C6.36677 9.10189 6.18726 9.17625 6.00008 9.17625C5.81291 9.17625 5.6334 9.10189 5.50104 8.96954C5.36869 8.83719 5.29433 8.65768 5.29433 8.4705V7.059C5.29433 6.87182 5.36869 6.69231 5.50104 6.55996C5.6334 6.42761 5.81291 6.35325 6.00008 6.35325C6.18726 6.35325 6.36677 6.42761 6.49912 6.55996C6.63148 6.69231 6.70583 6.87182 6.70583 7.059V8.4705Z"
                fill="white"
                fillOpacity="0.6"
              />
            </svg>
          </span>
        </div>
      )}
    </CarouselItem>
  )
}

const arrows = Array.from({ length: 60 })

const MarqueeArrows = () => {
  return (
    <div className="absolute top-[50px] z-[-1] w-full">
      <div className="relative min-w-[1600px]">
        <Marquee direction="right" speed={30}>
          {arrows.map((_, idx) => (
            <Arrow key={idx} />
          ))}
        </Marquee>
        <div className="bg-line-gradient pointer-events-none absolute inset-y-0 top-[3px] left-0 z-0 h-[4px] w-[250px]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 -z-[-1] w-[40px] bg-[#121312]" />
      </div>
    </div>
  )
}

const Arrow = () => (
  <svg
    width="6"
    height="9"
    viewBox="0 0 6 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.518233 1.31582C0.296715 0.98354 0.534911 0.538467 0.934259 0.538467H2.79815C3.1325 0.538467 3.44473 0.705569 3.6302 0.983767L5.6302 3.98377C5.85413 4.31967 5.85413 4.75727 5.6302 5.09317L3.6302 8.09317C3.44473 8.37137 3.1325 8.53847 2.79815 8.53847H0.934258C0.53491 8.53847 0.296715 8.09339 0.518233 7.76112L2.29687 5.09317C2.5208 4.75727 2.5208 4.31967 2.29687 3.98377L0.518233 1.31582Z"
      fill="#B6FF00"
    />
  </svg>
)
