import { useEffect, useRef, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { hapticFeedback } from '@telegram-apps/sdk'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/utils'

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
}: {
  onAdd?: (value: number) => void
  onSubtract?: (value: number) => void
  onUnitChange?: (value: TUnit) => void
  onValueChange?: (value: number) => void
  value?: number
  maxValue?: number
  unit?: TUnit | string
  className?: string
}) => {
  const [count, setCount] = useState<number>(value)
  const [currentUnit, setCurrentUnit] = useState<TUnit | string>(unit)

  useEffect(() => {
    setCurrentUnit(unit)
  }, [unit])

  return (
    <div
      className={cn(
        'font-pixel rounded-[24px] border border-white/10 p-4 backdrop-blur-[16px]',
        className,
      )}
    >
      <div className="flex justify-between items-center py-[9px] px-4">
        <HandlerButton
          disabled={count <= 1}
          onClick={() => {
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
        <span className="text-[#8633F1] font-[400] text-[48px] leading-[120%] [text-shadow:0px_0px_60px_#A55EFF]">
          {count}
        </span>
        <HandlerButton
          disabled={count >= maxValue}
          onClick={() => {
            setCount((currentCount) => {
              if (currentCount < maxValue) {
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
        onValueChange={(value: string) => {
          const newUnit = value as TUnit
          setCurrentUnit(newUnit)
          onUnitChange?.(newUnit)
        }}
        className="flex gap-4 justify-center"
      >
        {(['days', 'weeks', 'years'] as Array<TUnit>).map((option) => (
          <div key={option}>
            <RadioGroupItem
              value={option}
              id={option}
              className="hidden peer"
            />
            <label
              htmlFor={option}
              className={cn(
                'py-1.5 px-5 rounded-[8px] cursor-pointer leading-[120%] text-[12px] text-white/50 font-[400] uppercase bg-gradient-to-b from-white/0 to-white/5',
                currentUnit === option &&
                  'border border-[#8C35FB] text-[#8633F1] bg-gradient-to-b from-[#8C35FB]/0 to-[#8C35FB]/40',
              )}
            >
              {option}
            </label>
          </div>
        ))}
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
