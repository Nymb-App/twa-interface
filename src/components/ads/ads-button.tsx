import { useAccountMe } from '@/hooks/api/use-account'
import { useApi } from '@/hooks/api/use-api'
import { ADSGRAM_APP_ID } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { convertTimestampToLargestUnit } from '@/utils'
import { useAdsgram } from '@adsgram/react'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import useSound from 'use-sound'
import { ActionButton } from '../ui/action-button'

export const AdsButton = ({
  className,
  onClick,
  onBtnClick,
  time,
  displayPercent,
  isPercent,
  children,
  classNameText,
  labelColor,
  labelOpacity,
  disabled,
  onReward,
  onError,
}: {
  className?: string
  classNameText?: string
  onBtnClick?: () => void
  onClick?: () => void
  time: number
  displayPercent?: number
  isPercent?: boolean
  children?: React.ReactNode
  labelOpacity?: number
  labelColor?: string
  disabled?: boolean
  onReward?: () => void
  onError?: () => void
}) => {
  const { post } = useApi()
  const { accountQuery } = useAccountMe()
  const [isAnimationStart, setIsAnimationStart] = useState(true)
  const [isDisabled, setIsDisabled] = useState(disabled)
  const [play, { stop }] = useSound('/sounds/Button.aac')

  useEffect(() => {
    return () => stop()
  }, [play])

  const isDisabledButton = useMemo(() => {
    if (disabled !== undefined) return disabled
    return isDisabled || isAnimationStart
  }, [disabled, isAnimationStart, isDisabled])

  const share = useMutation({
    mutationFn: (timeShare: number) =>
      post('/tasks/share', { time: timeShare }),
    onSuccess: () => {
      accountQuery.refetch()
    },
  })

  const timeDisplay = useMemo(() => {
    if (isPercent) {
      return `${displayPercent}%`
    }
    const { time: value, label } = convertTimestampToLargestUnit(
      time * 1000,
      true,
      true,
    )
    return `${value} ${label}`
  }, [isPercent, time, displayPercent])

  const handleReward = (): void => {
    setIsDisabled(true)
    share.mutate(time)
    onClick?.()
    onReward?.()
  }

  const handleError = (): void => {
    console.error('Task error')
    onError?.()
  }

  const { show } = useAdsgram({
    blockId: ADSGRAM_APP_ID,
    debug: false,
    onReward: handleReward,
    onError: handleError,
  })

  return (
    <ActionButton
      disabled={isDisabledButton}
      onAnimationEnd={() => setIsAnimationStart(false)}
      className={cn(
        'text-[#FFFFFF] bg-linear-to-b from-[#8C35FB] to-[#6602E7] relative',
        className,
      )}
      onClick={() => {
        play()
        show()
        onBtnClick?.()

        setTimeout(() => handleReward, 30000)
      }}
    >
      {children ? (
        children
      ) : (
        <span className={classNameText}>get +{timeDisplay} reward</span>
      )}
      <AdsLabelSvg
        labelOpacity={labelOpacity}
        labelColor={labelColor}
        className="absolute top-2 right-2"
      />
    </ActionButton>
  )
}

const AdsLabelSvg = ({
  labelOpacity,
  labelColor,
  className,
}: {
  labelOpacity?: number
  labelColor?: string
  className?: string
}) => {
  return (
    <svg
      className={cn(className)}
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={labelOpacity || '0.5'}>
        <path
          d="M22 2H20V4H22V2H24V16H22V14H20V16H22V18H2V16H4V14H2V16H0V2H2V4H4V2H2V0H22V2ZM8 5V6H7V8H6V11H5V13H7V12H8V11H10V12H11V13H13V11H12V8H11V6H10V5H8ZM14 5V13H18V12H19V11H20V7H19V6H18V5H14ZM17 7V8H18V10H17V11H16V7H17ZM10 8V9H8V8H10Z"
          fill={labelColor || 'white'}
        />
      </g>
    </svg>
  )
}
