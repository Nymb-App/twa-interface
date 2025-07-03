import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeParts(
  days: number,
  minutes: number,
  seconds: number,
) {
  const allSeconds = days * 24 * 60 * 60 + minutes * 60 + seconds
  const allMinutes = Math.floor(allSeconds / 60)
  const allHours = Math.floor(allMinutes / 60)

  const d = Math.floor(allHours / 24)
  const h = allHours % 24
  const m = allMinutes % 60
  const s = allSeconds % 60

  return [d, h, m, s]
}

export function formatDurationFromSeconds(seconds: number): string {
  if (seconds <= 0) {
    return '0 s'
  }

  const days = Math.floor(seconds / 86400)
  if (days > 0) {
    return `${days} d`
  }

  const hours = Math.floor(seconds / 3600)
  if (hours > 0) {
    return `${hours} h`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes > 0) {
    return `${minutes} m`
  }

  return `${seconds} s`
}

export const convertTimestampToLargestUnit = (
  timestamp: number,
  roundToUnit: boolean = true,
  fullLabel = false,
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

  const timeUnitsFull = [
    { label: 'years', value: 365 * 24 * 60 * 60 },
    { label: 'months', value: 30 * 24 * 60 * 60 },
    { label: 'weeks', value: 7 * 24 * 60 * 60 },
    { label: 'days', value: 24 * 60 * 60 },
    { label: 'hours', value: 60 * 60 },
    { label: 'minutes', value: 60 },
    { label: 'seconds', value: 1 },
  ]

  const unitsDisplay = fullLabel ? timeUnitsFull : timeUnits

  for (const unit of unitsDisplay) {
    const amount = Math.floor(delta / unit.value)
    if (amount > 0) {
      if (roundToUnit) {
        // Округляем timestamp до выбранной единицы
        return {
          time: amount,
          label: unit.label,
          roundedTimestamp: amount * unit.value * 1000, // Возвращаем округленное значение
        }
      }
      return { time: amount, label: unit.label }
    }
  }

  return { time: 0, label: 'd' }
}

export function formatTimeReward(seconds: number): string {
  if (seconds <= 0) {
    return '0 HOURS'
  }

  // Если время в секундах точно делится на количество секунд в дне, показываем дни.
  if (seconds % 86400 === 0) {
    const days = seconds / 86400
    return `${days} DAY${days > 1 ? 'S' : ''}`
  }

  // В противном случае, всегда показываем часы.
  // Округляем до ближайшего часа для более чистого отображения.
  const hours = Math.round(seconds / 3600)

  // Если после округления 0, но время было, вернем 1 час.
  if (hours === 0 && seconds > 0) {
    return '1 HOUR'
  }

  return `${hours} HOUR${hours > 1 ? 'S' : ''}`
}

export function calculateDaysBetween(date1: Date, date2: Date): number {
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())
  const MS_IN_DAY = 1000 * 60 * 60 * 24
  return Math.floor((utc2 - utc1) / MS_IN_DAY)
}
