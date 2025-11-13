import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/utils'
import { hapticFeedback } from '@tma.js/sdk'
import { useEffect, useRef, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import useSound from 'use-sound'

type TUnit = 'days' | 'weeks' | 'years'
export const GiftSelector = ({
  onAdd,
  onSubtract,
  onValueChange,
  onUnitChange,
  value = 10,
  unit = 'weeks',
  maxValue = 100,
  className,
  maxDays,
}: {
  onAdd?: (SelectorValue: number) => void
  onSubtract?: (SelectorValue: number) => void
  onUnitChange?: (SelectorValue: TUnit) => void
  onValueChange?: (SelectorValue: number) => void
  value?: number
  maxValue?: number
  unit?: TUnit | string
  className?: string
  maxDays?: number
}) => {
  const [count, setCount] = useState<number>(value)
  const [currentUnit, setCurrentUnit] = useState<TUnit | string>(unit)
  const [play, { stop }] = useSound('sounds/Button.aac')

  const computedMaxValue = (() => {
    if (maxDays === undefined) return maxValue
    switch (currentUnit) {
      case 'days':
        return maxDays
      case 'weeks':
        return Math.floor(maxDays / 7)
      case 'years':
        return Math.floor(maxDays / 365)
      default:
        return maxValue
    }
  })()

  // значение, отображаемое в UI, не превышает максимально доступного
  const displayCount = Math.min(count, computedMaxValue)

  useEffect(() => {
    setCurrentUnit(unit)
  }, [unit])

  useEffect(() => {
    if (count > computedMaxValue) {
      setCount(computedMaxValue)
      onValueChange?.(computedMaxValue)
    }
  }, [computedMaxValue])

  useEffect(() => {
    setCount(value)
  }, [value])

  useEffect(() => {
    return () => stop()
  }, [play])

  return (
    <div
      className={cn(
        'font-pixel rounded-[24px] border border-white/10 p-4 backdrop-blur-lg',
        className,
      )}
    >
      <div className="flex justify-between items-center py-[9px] px-4">
        <HandlerButton
          disabled={count <= 1}
          onClick={() => {
            play()
            setCount((currentCount) => {
              if (currentCount > 1) {
                const newCount = currentCount - 1
                onSubtract?.(newCount)
                onValueChange?.(newCount)
                return newCount
              }
              return currentCount
            })
          }}
        >
          <FiMinus
            className="text-white absolute top-1/2 left-1/2 -translate-1/2"
            size={32}
          />
        </HandlerButton>
        <span
          className={cn(
            'text-[#8633F1] font-[400] text-[48px] mr-3 leading-[120%] [text-shadow:0px_0px_60px_#A55EFF]',
            String(displayCount).startsWith('1') && 'mr-6',
          )}
        >
          {displayCount}
        </span>
        <HandlerButton
          disabled={count >= computedMaxValue}
          onClick={() => {
            play()
            setCount((currentCount) => {
              if (currentCount < computedMaxValue) {
                const newCount = currentCount + 1
                onAdd?.(newCount)
                onValueChange?.(newCount)
                return newCount
              }
              return currentCount
            })
          }}
        >
          <FiPlus
            className="text-white absolute top-1/2 left-1/2 -translate-1/2"
            size={32}
          />
        </HandlerButton>
      </div>

      <hr className="bg-white opacity-15 my-4" />

      <RadioGroup
        defaultValue="weeks"
        value={currentUnit}
        onValueChange={(selectorValue: string) => {
          play()
          const newUnit = selectorValue as TUnit
          setCurrentUnit(newUnit)
          onUnitChange?.(newUnit)
        }}
        className="flex gap-4 justify-center"
      >
        {(['days', 'weeks', 'years'] as Array<TUnit>).map((option) => {
          const isAvailable = (() => {
            if (maxDays === undefined) return true
            switch (option) {
              case 'days':
                return maxDays >= 1
              case 'weeks':
                return maxDays >= 7
              case 'years':
                return maxDays >= 365
              default:
                return true
            }
          })()

          return (
            <div key={option}>
              <RadioGroupItem
                disabled={!isAvailable}
                value={option}
                id={option}
                className="hidden peer"
              />
              <label
                htmlFor={option}
                className={cn(
                  'py-1.5 px-5 rounded-[8px] leading-[120%] text-[12px] font-[400] uppercase bg-gradient-to-b from-white/0 to-white/5',
                  isAvailable
                    ? 'cursor-pointer text-white/50'
                    : 'opacity-30 cursor-not-allowed text-white/30',
                  currentUnit === option &&
                    'outline outline-[#8C35FB] text-[#8633F1] bg-gradient-to-b from-[#8C35FB]/0 to-[#8C35FB]/40',
                )}
              >
                {option}
              </label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}

const HandlerButton = ({
  onClick,
  className,
  children,
  disabled = false,
}: {
  onClick?: () => void
  className?: string
  children: React.ReactNode
  disabled?: boolean
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const stopActions = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handlePointerDown = () => {
    stopActions()
    onClick?.()

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onClick?.()
      }, 150)

      if (!disabled && hapticFeedback.notificationOccurred.isAvailable()) {
        hapticFeedback.notificationOccurred('success')
      }
    }, 500)
  }

  return (
    <button
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={stopActions}
      onPointerLeave={stopActions}
      className={cn(
        'p-2 bg-[#8C35FB29] rounded-[14px] size-[40px] relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  )
}
