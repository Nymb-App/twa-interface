import Countdown from 'react-countdown'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { LevelsList } from './levels-list'

const Completionist = () => <span>You are good to go!</span>

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
    return <Completionist />
  } else {
    // Render a countdown
    const computedWeeks = Math.floor(days / 7)
    const remainingDays = days % 7
    const getColorClass = (value: number) =>
      value === 0
        ? 'text-[#FFFFFF]/40 font-[400] text-[30px]'
        : 'font-[400] text-[30px] text-[#B6FF00] relative before:content-[""] before:absolute before:inset-0 before:rounded-full before:blur-[16px] before:opacity-35 before:z-[-1] before:bg-[#B6FF00]'
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
              className={`flex flex-col items-center relative  ${
                index !== 0 &&
                'before:content-[":"] before:text-[30px] before:absolute before:-left-[22px] before:top-[18px] before:-translate-y-1/2 before:text-gray-500'
              }`}
            >
              <p className={`leading-[120%] mb-2 ${getColorClass(item.value)}`}>
                {zeroPad(item.value)}
              </p>

              <span className="text-[10px] font-[400] uppercase text-[#FFFFFF]/40">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const ProgressSection = () => {
  return (
    <div className="font-pixel mb-6 border-[#1D1F1D] pb-4 my-gradient-border">
      <div className="flex justify-between items-center px-3">
        <div className="flex items-center bg-[#1D1F1D] py-2 px-3 rounded-[16px]">
          <svg
            className="!w-[24px] !h-[24px]"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 28.5H15V30H12V27H13.5V28.5ZM16.5 28.5H15V27H16.5V28.5ZM15 27H13.5V24H15V27ZM18 27H16.5V25.5H18V27ZM19.5 25.5H18V24H19.5V25.5ZM16.5 24H15V21H16.5V24ZM21 24H19.5V22.5H21V24ZM22.5 22.5H21V21H22.5V22.5ZM10.5 18H18V21H16.5V19.5H9V16.5H10.5V18ZM24 21H22.5V19.5H24V21ZM25.5 19.5H24V18H25.5V19.5ZM19.5 15H27V18H25.5V16.5H18V12H19.5V15ZM12 16.5H10.5V15H12V16.5ZM13.5 15H12V13.5H13.5V15ZM15 13.5H13.5V12H15V13.5ZM16.5 12H15V10.5H16.5V12ZM21 12H19.5V9H21V12ZM18 10.5H16.5V9H18V10.5ZM19.5 9H18V7.5H19.5V9ZM22.5 9H21V7.5H19.5V6H22.5V9Z"
              fill="#B6FF00"
            />
          </svg>
          <span className="text-sm">1000</span>
        </div>
        <h1 className="text-[24px] uppercase">home</h1>
        <div className="flex items-center bg-[#1D1F1D] py-2 px-3 rounded-[16px] gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-sm font-inter lowercase font-semibold">
            tevial
          </span>
        </div>
      </div>
      <LevelsList />
      <Countdown date={Date.now() + 150234100} renderer={renderer}>
        <Completionist />
      </Countdown>
    </div>
  )
}

export default ProgressSection
