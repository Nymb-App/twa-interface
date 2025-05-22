import Countdown from 'react-countdown'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { LevelsList } from './levels-list'
import { cn } from '@/utils'
import EnergyIcon from '@/assets/icons/energy'
import { FlickeringGrid } from '../magicui/flickering-grid'

const zeroPad = (num: number) =>
  num === 0 ? String(num).padStart(2, '0') : num

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}) => {
  if (completed) {
    return <span>00:00:00:00</span>
  } else {
    // Render a countdown
    const computedWeeks = Math.floor(days / 7)
    const remainingDays = days % 7
    const getColorClass = (value: number) =>
      value === 0
        ? 'text-[#FFFFFF]/40 font-[400] text-[30px]'
        : 'font-[400] text-[30px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]'
    return (
      <div className="text-center">
        <div className="flex justify-center gap-6">
          {[
            { label: 'Weeks', value: computedWeeks },
            { label: 'Days', value: remainingDays },
            { label: 'Hours', value: hours },
            { label: 'Minutes', value: minutes },
            { label: 'Seconds', value: seconds },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`w-[50px] relative ${
                index !== 0 &&
                'before:content-[":"] before:text-[30px] before:absolute before:-left-[25px] before:top-[22px] before:-translate-y-1/2 before:text-gray-500'
              }`}
            >
              <p
                className={cn(
                  item.value >= 1 && item.value <= 19 && 'pr-3',
                  `leading-[120%] mb-2 ${getColorClass(item.value)}`,
                )}
              >
                {zeroPad(item.value)}
              </p>
              <p className="text-[10px] font-[400] uppercase text-[#FFFFFF]/40">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const ProgressSection = () => {
  return (
    <header className="relative w-full font-pixel px-3">
      {/* Top part */}
      <div className='inline-flex justify-between w-full'>
        {/* Left card */}
        <div className='inline-flex items-center justify-between bg-[#1D1F1D] rounded-2xl h-[40px] pl-2 pr-3'>
          <EnergyIcon className='size-[28px]'/>
          <span className="text-base">1000</span>
        </div>
        
        <h1 className="text-2xl">HOME</h1>

        {/* Right card */}
        <div className='inline-flex items-center justify-between gap-2 bg-[#1D1F1D] rounded-2xl h-[40px] pl-2 pr-3'>
          <Avatar className="rounded-lg size-[28px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className=" font-inter text-base font-semibold">unknown</span>
        </div>
      </div>

      <FlickeringGrid
        className="absolute mask-[radial-gradient(ellipse_250px_80px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="#B6FF00"
        maxOpacity={0.6}
        flickerChance={0.4}
        autoResize={false}
        width={450}
        height={100}
      />
      <LevelsList className='my-4' />

      <div className='relative'>
        <Countdown
          date={Date.now() + 150234100}
          renderer={renderer}
          intervalDelay={1000}
        />

        <img
          src='home-bg.png'
          className='absolute w-full min-w-[105%] -top-[10px] left-1/2 -translate-x-1/2'
        />
      </div>
    </ header>
  )
}

export default ProgressSection