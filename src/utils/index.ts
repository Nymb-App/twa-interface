import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export const formatTimeParts = (
  totalDays: number,
  minutes: number,
  seconds: number,
) => [
  Math.floor(totalDays / 365),
  Math.floor((totalDays % 365) / 30),
  Math.floor((totalDays % 30) / 7),
  totalDays % 7,
  minutes % 60,
  seconds % 60,
]

export const convertTimestampToLargestUnit = (
  timestamp: number,
): any | number => {
  if (timestamp < 0) return { time: 0, label: 'd' }
  let delta = Math.floor(timestamp / 1000)
  if (delta < 0) delta = 0

  const timeUnits = [
    { label: 'y', value: 365 * 24 * 60 * 60 },
    { label: 'm', value: 30 * 24 * 60 * 60 },
    { label: 'w', value: 7 * 24 * 60 * 60 },
    { label: 'd', value: 24 * 60 * 60 },
    { label: 'h', value: 60 * 60 },
    { label: 'm', value: 60 },
    { label: 's', value: 1 },
  ]

  for (const unit of timeUnits) {
    const amount = Math.floor(delta / unit.value)
    if (amount > 0) {
      return { time: amount, label: unit.label }
    }
  }

  return { time: 0, label: 'd' }
}
