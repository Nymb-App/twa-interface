import React from 'react'

const zeroPad = (num: number, length = 2) => String(num).padStart(length, '0')

const formatTimeParts = (
  days: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
) => {
  const weeks = Math.floor(days / 7)
  const remDays = days % 7
  const mins = minutes % 60
  const ms = Math.floor(milliseconds / 10) // сотые миллисекунды
  return [weeks, remDays, mins, seconds, ms]
}

type CountdownTimerDisplayProps = {
  days: number
  minutes: number
  seconds: number
  milliseconds: number
  completed: boolean
}

export const CountdownTimerDisplay: React.FC<CountdownTimerDisplayProps> = ({
  days,
  minutes,
  seconds,
  milliseconds,
  completed,
}) => {
  if (completed) {
    return (
      <div className="font-pixel font-[400] text-[12px] leading-[120%] mt-1 text-[#FFFFFF99]">
        00:00:00:00:00
      </div>
    )
  }

  const timeParts = formatTimeParts(days, minutes, seconds, milliseconds)

  return (
    <div className="font-pixel font-[400] text-[12px] leading-[120%] mt-1">
      {timeParts.map((val, i) => (
        <span
          key={i}
          className={val > 0 ? 'text-[#B6FF00]' : 'text-[#FFFFFF99]'}
        >
          {zeroPad(val)}
          {i !== timeParts.length - 1 && ':'}
        </span>
      ))}
    </div>
  )
}
