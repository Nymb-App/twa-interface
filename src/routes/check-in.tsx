import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { CheckInButton } from '@/components/ui/check-in-button'
import { FallbackLoader } from '@/components/ui/fallback-loader'
import { PageLayout } from '@/components/ui/page-layout'
import type { CheckInRewards } from '@/hooks/use-get-daily-rewards'
import { useCheckIn } from '@/hooks/use-get-daily-rewards'
import { cn } from '@/lib/utils'
import {
  calculateDaysBetween,
  convertTimestampToLargestUnit,
} from '@/utils'
import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { zeroPad } from 'react-countdown'

export const Route = createFileRoute('/check-in')({
  component: RouteComponent,
})

function RouteComponent() {
  const { dailyRewardsQuery } = useCheckIn()

  const { data, isLoading, isError, error } = dailyRewardsQuery

  if (isLoading) {
    return (
      <PageLayout useFooter={false}>
        <div className="flex items-center justify-center h-64">
          <FallbackLoader />
        </div>
      </PageLayout>
    )
  }

  if (isError || !data) {
    return (
      <PageLayout useFooter={false}>
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-red-500">
            Error: {error?.message || 'Something went wrong'}
          </p>
        </div>
      </PageLayout>
    )
  }

  const currentDay = convertTimestampToDays(
    data.startedAt,
    data.nextAvailableAt,
  )

  return (
    <PageLayout className="relative" useFooter={false}>
      <FlickeringGrid
        className="absolute inset-0 z-0 mask-[radial-gradient(ellipse_250px_400px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="#b7ff01"
        maxOpacity={1}
        flickerChance={0.3}
        autoResize={false}
        width={450}
      />
      <CheckInHeader currentDay={currentDay === 0 ? 1 : currentDay + 1} />
      <div className="px-4">
        <CheckInInfoBlock rewards={data.rewards} />
        <CheckInDaysBlock currentDay={currentDay === 0 ? 1 : currentDay + 1} />
      </div>
      <CheckInButton className="fixed bottom-6 w-[calc(100%-2rem)] left-1/2 -translate-x-1/2 max-w-[450px] z-50" />
    </PageLayout>
  )
}

function CheckInHeader({ currentDay }: { currentDay: number }) {
  return (
    <header className="font-pixel mb-20 text-center text-[24px] font-normal text-[#FFFFFF] uppercase">
      <h1 className="mt-6 mb-10 leading-8">
        your daily <br /> rewards
      </h1>
      <div className="font-pixel mb-2 text-[80px] leading-[120%] text-[#B6FF00] [text-shadow:0px_12.0067px_24.0134px_rgba(182,255,0,0.3),_0px_0px_72.0403px_#B6FF00]">
        <span>{zeroPad(currentDay)}</span>
      </div>
      <h2>day check-in</h2>
    </header>
  )
}

const CheckInInfoBlock = ({ rewards }: { rewards: CheckInRewards }) => {
  const displayTime = convertTimestampToLargestUnit(
    rewards.time * 1000,
    false,
    false,
  )

  return (
    <section>
      <div className="font-inter mb-15 flex min-h-[104px] gap-3 px-5 text-center">
        <CheckInInfoBlockItem label="Energy">
          <div className="absolute top-[-15px] left-1/2 -translate-1/2">
            <img src="/power-img.webp" alt="power" />
          </div>
          <p className="font-pixel mt-4 mb-2 text-[24px] leading-8 tracking-[0.3px]">
            <span className="mr-2.5 text-[#A45FFF]">+{rewards.energy}</span>
          </p>
        </CheckInInfoBlockItem>
        <CheckInInfoBlockItem label="Time">
          <div className="absolute top-[-15px] left-1/2 -translate-1/2">
            <img src="/clock-img.webp" alt="clock" />
          </div>
          <p className="font-pixel mt-4 mb-2">
            <span className="mr-2.5 text-[24px] leading-8 tracking-[0.3px] text-[#B6FF00]">
              +{displayTime.time}
            </span>
            <span className="-ml-1 leading-[120%] text-[#FFFFFF]/40">
              {displayTime.label}
            </span>
          </p>
        </CheckInInfoBlockItem>
        {rewards.ticket > 0 && (
          <CheckInInfoBlockItem label="Ticket">
            <div className="absolute top-[-15px] left-1/2 -translate-1/2">
              <img src="/ticket-img.webp" alt="ticket" />
            </div>
            <p className="font-pixel mt-4 mb-2 text-[24px] leading-8 tracking-[0.3px]">
              <span className="mr-2.5 text-[#FBB107]">+{rewards.ticket}</span>
            </p>
          </CheckInInfoBlockItem>
        )}
      </div>
    </section>
  )
}

const CheckInInfoBlockItem = ({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) => {
  return (
    <div className="font-inter starboard-result-block-bg relative basis-1/2 rounded-2xl px-2 py-3 text-[14px] leading-[140%] font-[400] text-[#FFFFFF] backdrop-blur-[16px]">
      {children}
      <span>{label}</span>
    </div>
  )
}

const CheckInDaysBlock = ({ currentDay }: { currentDay: number }) => {
  const totalDays = 182

  return (
    <section>
      <Carousel
        opts={{
          startIndex: currentDay - 4,
        }}
        className="pl-2.5"
      >
        <CarouselContent>
          {Array.from({ length: totalDays }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/7.5">
              <div
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(255,255,255,0.16)_0%,_rgba(255,255,255,0)_100%)] backdrop-blur-[16px]',
                  index < currentDay &&
                    'bg-transparent bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(182,255,0,0.16)_0%,_rgba(182,255,0,0)_100%)]',
                  index < currentDay - 1 && 'opacity-50',
                )}
              >
                <span
                  className={cn(
                    'font-pixel text-[14px] leading-[120%] font-normal text-white',
                    index === currentDay - 1 && 'text-[#B6FF00]',
                    index + 1 > 9 && 'mr-1.5',
                    index + 1 >= 20 && 'mr-0',
                    index + 1 >= 100 && 'mr-1.5',
                  )}
                >
                  {index < currentDay - 1 ? (
                    <DoneSvgIcon />
                  ) : (
                    zeroPad(index + 1)
                  )}
                </span>
                {index !== 0 && index % 5 === 0 && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <TicketSmallSvgIcon />
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}

function convertTimestampToDays(startedAt: number, nextAvailableAt: number) {
  const startDate = new Date(startedAt * 1000)
  // The last completed check-in is the day before the next one is available.
  const MS_IN_DAY = 1000 * 60 * 60 * 24
  const lastCompletedCheckInDate = new Date(nextAvailableAt * 1000 - MS_IN_DAY)
  return calculateDaysBetween(startDate, lastCompletedCheckInDate) + 1
}

const DoneSvgIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="6" width="2" height="2" fill="#B6FF00" />
      <rect x="4" y="8" width="2" height="2" fill="#B6FF00" />
      <rect x="6" y="10" width="2" height="2" fill="#B6FF00" />
      <rect x="8" y="8" width="2" height="2" fill="#B6FF00" />
      <rect x="10" y="6" width="2" height="2" fill="#B6FF00" />
      <rect x="12" y="4" width="2" height="2" fill="#B6FF00" />
    </svg>
  )
}

const TicketSmallSvgIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.3999"
        y="8.94275"
        width="10.6667"
        height="0.666667"
        transform="rotate(-45 1.3999 8.94275)"
        fill="#FBB107"
      />
      <rect
        x="6.58521"
        y="14.1285"
        width="10.6667"
        height="0.666667"
        transform="rotate(-45 6.58521 14.1285)"
        fill="#FBB107"
      />
      <rect
        x="6.11377"
        y="13.6572"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 6.11377 13.6572)"
        fill="#FBB107"
      />
      <rect
        width="0.666667"
        height="0.666667"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 13.6562 6.1145)"
        fill="#FBB107"
      />
      <rect
        x="6.11377"
        y="12.7141"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 6.11377 12.7141)"
        fill="#FBB107"
      />
      <rect
        width="0.666667"
        height="0.666667"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.7134 6.1145)"
        fill="#FBB107"
      />
      <rect
        x="4.22803"
        y="10.8287"
        width="0.666667"
        height="1.33333"
        transform="rotate(-45 4.22803 10.8287)"
        fill="#FBB107"
      />
      <rect
        width="0.666667"
        height="1.33333"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 10.8276 4.22876)"
        fill="#FBB107"
      />
      <rect
        x="2.81372"
        y="9.41431"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 2.81372 9.41431)"
        fill="#FBB107"
      />
      <rect
        x="8.4707"
        y="9.41479"
        width="2"
        height="0.666667"
        transform="rotate(-45 8.4707 9.41479)"
        fill="#FBB107"
      />
      <rect
        x="6.11353"
        y="7.05774"
        width="2"
        height="0.666667"
        transform="rotate(-45 6.11353 7.05774)"
        fill="#FBB107"
      />
      <rect
        x="9.41333"
        y="7.52905"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 9.41333 7.52905)"
        fill="#FBB107"
      />
      <rect
        x="8.4707"
        y="7.52905"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 8.4707 7.52905)"
        fill="#FBB107"
      />
      <rect
        x="6.11353"
        y="8.00049"
        width="0.666667"
        height="2.66667"
        transform="rotate(-45 6.11353 8.00049)"
        fill="#FBB107"
      />
      <rect
        width="0.666667"
        height="0.666667"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 9.41357 2.8147)"
        fill="#FBB107"
      />
      <rect
        x="2.81372"
        y="10.3571"
        width="0.666667"
        height="1.33333"
        transform="rotate(-45 2.81372 10.3571)"
        fill="#FBB107"
      />
      <rect
        width="0.666667"
        height="1.33333"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 10.3564 2.8147)"
        fill="#FBB107"
      />
      <rect
        x="4.69946"
        y="12.2428"
        width="0.666667"
        height="1.33333"
        transform="rotate(-45 4.69946 12.2428)"
        fill="#FBB107"
      />
      <rect
        width="0.666667"
        height="1.33333"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.2422 4.70044)"
        fill="#FBB107"
      />
      <rect
        x="1.87109"
        y="9.41431"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 1.87109 9.41431)"
        fill="#FBB107"
      />
      <rect
        width="0.666667"
        height="0.666667"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 9.41357 1.87195)"
        fill="#FBB107"
      />
    </svg>
  )
}
