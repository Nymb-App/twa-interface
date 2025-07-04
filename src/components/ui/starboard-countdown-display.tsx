import { zeroPad } from 'react-countdown'
import React from 'react'
import { cn } from '@/utils'

export const StarboardCountdownDisplay = ({
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
    completed?: boolean
}) => {
    const timerClassActive = completed ? 'text-white/40' : 'text-[#B6FF00]'
    const timerClassDimmed = 'text-white/40'

    const years = Math.floor(days / 365)
    const weeks = Math.floor((days % 365) / 7)
    const displayDays = (days % 365) % 7

    const timeParts = [
        { value: years, pad: 3 },
        { value: weeks },
        { value: displayDays },
        { value: hours },
        { value: minutes },
        { value: seconds },
    ]

    let hasFoundNonZero = false

    return (
        <p className={cn('font-pixel text-sm inline-flex items-center')}>
            {timeParts.map((part, index) => {
                const isNonZero = part.value > 0
                const isActive = isNonZero || hasFoundNonZero

                if (isActive) {
                    hasFoundNonZero = true
                }

                const partClass = isActive ? timerClassActive : timerClassDimmed

                return (
                    <React.Fragment key={index}>
                        {index > 0 && <span className={'mx-px text-lg text-white/40'}>:</span>}
                        <span
                            className={cn(
                                partClass,
                                String(part.value).startsWith('1') &&
                                    index !== 0 &&
                                    '-ml-1',
                            )}
                        >
                            {zeroPad(part.value, part.pad)}
                        </span>
                    </React.Fragment>
                )
            })}
        </p>
    )
} 