/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createFileRoute } from '@tanstack/react-router'
import { zeroPad } from 'react-countdown'
import type { ReactNode } from 'react'
import { PageLayout } from '@/components/ui/page-layout'
import { Container } from '@/components/ui/container'
import { cn } from '@/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'

export const Route = createFileRoute('/check-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout useFooter={false} useCheckInButton={true}>
      <Container>
        <CheckInHeader />
        <CheckInInfoBlock />
      </Container>
      <CheckInDaysBlock />
    </PageLayout>
  )
}

function CheckInHeader() {
  const currentDay = 5

  return (
    <header className="font-pixel font-[400] text-[24px] text-[#FFFFFF] text-center uppercase mb-20">
      <h1 className="mt-6 mb-20 leading-[32px]">
        your daily <br /> rewards
      </h1>
      <div className="font-pixel text-[80px] leading-[120%] mb-2 text-[#B6FF00] [text-shadow:0px_12.0067px_24.0134px_rgba(182,255,0,0.3),_0px_0px_72.0403px_#B6FF00]">
        <span className={cn((currentDay > 9 || currentDay > 99) && 'mr-9')}>
          {zeroPad(currentDay)}
        </span>
      </div>
      <h2>day check-in</h2>
      <FlickeringGrid
        className="absolute inset-0 z-0 mask-[radial-gradient(ellipse_250px_400px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="#b7ff01"
        maxOpacity={0.5}
        flickerChance={0.3}
        autoResize={false}
        width={450}
      />
    </header>
  )
}

const CheckInInfoBlock = () => {
  const value1 = 1000
  const value2 = 1
  // const value3 = 1
  return (
    <section>
      <div className="font-inter flex gap-3 px-5 text-center min-h-[104px] mb-15">
        <CheckInInfoBlockItem label="Energy">
          <div className="absolute top-0 left-1/2 -translate-1/2">
            <PowerSvgIcon />
          </div>
          <p className="font-pixel text-[24px] leading-[32px] tracking-[0.3px] mt-4 mb-2">
            <span className="mr-2.5">{value1}</span>
          </p>
        </CheckInInfoBlockItem>
        <CheckInInfoBlockItem label="Time">
          <div className="absolute top-0 left-1/2 -translate-1/2">
            <ClockSvgIcon />
          </div>
          <p className="font-pixel mt-4 mb-2">
            <span className="text-[#B6FF00] text-[24px] leading-[32px] tracking-[0.3px] mr-2.5">
              {zeroPad(value2)}
            </span>
            <span className="leading-[120%] text-[#FFFFFF]/40 -ml-1">d</span>
          </p>
        </CheckInInfoBlockItem>
        {/* <CheckInInfoBlockItem label="Ticket">
          <div className="absolute top-0 left-1/2 -translate-1/2">
            <TicketSvgIcon />
          </div>
          <p className="font-pixel text-[24px] leading-[32px] tracking-[0.3px] mt-4 mb-2">
            <span className="mr-2.5">{value3}</span>
          </p>
        </CheckInInfoBlockItem> */}
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
    <div className="relative font-inter text-[14px] leading-[140%] text-[#FFFFFF] font-[400] basis-1/2 px-2 py-3 rounded-[16px] starboard-result-block-bg backdrop-blur-[16px]">
      {children}
      <span>{label}</span>
    </div>
  )
}

const CheckInDaysBlock = () => {
  return (
    <section>
      {/* <Carousel opts={{ slidesToScroll: 5 }} className="pl-5"> */}
      <Carousel opts={{ slidesToScroll: 5 }} className="pl-2.5">
        <CarouselContent>
          {Array.from({ length: 182 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/7.5">
              <div
                className={cn(
                  'relative flex justify-center items-center w-10 h-10 bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(255,255,255,0.16)_0%,_rgba(255,255,255,0)_100%)] backdrop-blur-[16px] rounded-full',
                  index < 5 &&
                    'bg-transparent bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(182,255,0,0.16)_0%,_rgba(182,255,0,0)_100%)]',
                  index < 4 && 'opacity-50',
                )}
              >
                <span
                  className={cn(
                    'font-pixel text-[#FFFFFF] font-[400] text-[14px] leading-[120%]',
                    index === 4 && 'text-[#B6FF00]',
                    index + 1 > 9 && 'mr-1.5',
                    index + 1 >= 20 && 'mr-0',
                    index + 1 >= 100 && 'mr-1.5',
                  )}
                >
                  {index < 4 ? <DoneSvgIcon /> : zeroPad(index + 1)}
                </span>
                {index !== 0 && index % 5 === 0 && (
                  <div className="absolute -top-[2px] left-1/2 -translate-y-1/2 -translate-x-1/2">
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

const PowerSvgIcon = () => {
  return (
    <svg
      width="25"
      height="32"
      viewBox="0 0 25 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.83325 30H8.83325V32H4.83325V28H6.83325V30ZM10.8333 30H8.83325V28H10.8333V30ZM8.83325 28H6.83325V24H8.83325V28ZM12.8333 28H10.8333V26H12.8333V28ZM14.8333 26H12.8333V24H14.8333V26ZM10.8333 24H8.83325V20H10.8333V24ZM16.8333 24H14.8333V22H16.8333V24ZM18.8333 22H16.8333V20H18.8333V22ZM2.83325 16H12.8333V20H10.8333V18H0.833252V14H2.83325V16ZM20.8333 20H18.8333V18H20.8333V20ZM22.8333 18H20.8333V16H22.8333V18ZM14.8333 12H24.8333V16H22.8333V14H12.8333V8H14.8333V12ZM4.83325 14H2.83325V12H4.83325V14ZM6.83325 12H4.83325V10H6.83325V12ZM8.83325 10H6.83325V8H8.83325V10ZM10.8333 8H8.83325V6H10.8333V8ZM16.8333 8H14.8333V4H16.8333V8ZM12.8333 6H10.8333V4H12.8333V6ZM14.8333 4H12.8333V2H14.8333V4ZM18.8333 4H16.8333V2H14.8333V0H18.8333V4Z"
        fill="#B6FF00"
      />
    </svg>
  )
}

const ClockSvgIcon = () => {
  return (
    <svg
      width="49"
      height="48"
      viewBox="0 0 49 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.5 40H18.5V38H30.5V40ZM18.5 38H14.5V36H18.5V38ZM34.5 38H30.5V36H34.5V38ZM14.5 36H12.5V34H14.5V36ZM36.5 36H34.5V34H36.5V36ZM12.5 34H10.5V30H12.5V34ZM38.5 34H36.5V30H38.5V34ZM10.5 30H8.5V18H10.5V30ZM40.5 30H38.5V18H40.5V30ZM26.5 14V26H16.5V24H24.5V14H26.5ZM12.5 18H10.5V14H12.5V18ZM38.5 18H36.5V14H38.5V18ZM14.5 14H12.5V12H14.5V14ZM36.5 14H34.5V12H36.5V14ZM18.5 12H14.5V10H18.5V12ZM34.5 12H30.5V10H34.5V12ZM30.5 10H18.5V8H30.5V10Z"
        fill="#B6FF00"
      />
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
        fill="#B6FF00"
      />
      <rect
        x="6.58521"
        y="14.1285"
        width="10.6667"
        height="0.666667"
        transform="rotate(-45 6.58521 14.1285)"
        fill="#B6FF00"
      />
      <rect
        x="6.11377"
        y="13.6572"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 6.11377 13.6572)"
        fill="#B6FF00"
      />
      <rect
        width="0.666667"
        height="0.666667"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 13.6562 6.1145)"
        fill="#B6FF00"
      />
      <rect
        x="6.11377"
        y="12.7141"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 6.11377 12.7141)"
        fill="#B6FF00"
      />
      <rect
        width="0.666667"
        height="0.666667"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.7134 6.1145)"
        fill="#B6FF00"
      />
      <rect
        x="4.22803"
        y="10.8287"
        width="0.666667"
        height="1.33333"
        transform="rotate(-45 4.22803 10.8287)"
        fill="#B6FF00"
      />
      <rect
        width="0.666667"
        height="1.33333"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 10.8276 4.22876)"
        fill="#B6FF00"
      />
      <rect
        x="2.81372"
        y="9.41431"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 2.81372 9.41431)"
        fill="#B6FF00"
      />
      <rect
        x="8.4707"
        y="9.41479"
        width="2"
        height="0.666667"
        transform="rotate(-45 8.4707 9.41479)"
        fill="#B6FF00"
      />
      <rect
        x="6.11353"
        y="7.05774"
        width="2"
        height="0.666667"
        transform="rotate(-45 6.11353 7.05774)"
        fill="#B6FF00"
      />
      <rect
        x="9.41333"
        y="7.52905"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 9.41333 7.52905)"
        fill="#B6FF00"
      />
      <rect
        x="8.4707"
        y="7.52905"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 8.4707 7.52905)"
        fill="#B6FF00"
      />
      <rect
        x="6.11353"
        y="8.00049"
        width="0.666667"
        height="2.66667"
        transform="rotate(-45 6.11353 8.00049)"
        fill="#B6FF00"
      />
      <rect
        width="0.666667"
        height="0.666667"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 9.41357 2.8147)"
        fill="#B6FF00"
      />
      <rect
        x="2.81372"
        y="10.3571"
        width="0.666667"
        height="1.33333"
        transform="rotate(-45 2.81372 10.3571)"
        fill="#B6FF00"
      />
      <rect
        width="0.666667"
        height="1.33333"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 10.3564 2.8147)"
        fill="#B6FF00"
      />
      <rect
        x="4.69946"
        y="12.2428"
        width="0.666667"
        height="1.33333"
        transform="rotate(-45 4.69946 12.2428)"
        fill="#B6FF00"
      />
      <rect
        width="0.666667"
        height="1.33333"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.2422 4.70044)"
        fill="#B6FF00"
      />
      <rect
        x="1.87109"
        y="9.41431"
        width="0.666667"
        height="0.666667"
        transform="rotate(-45 1.87109 9.41431)"
        fill="#B6FF00"
      />
      <rect
        width="0.666667"
        height="0.666667"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 9.41357 1.87195)"
        fill="#B6FF00"
      />
    </svg>
  )
}
