import { shareURL } from '@telegram-apps/sdk'
import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ActionButton } from './action-button'
import { cn, convertTimestampToLargestUnit } from '@/utils'
import { useApi } from '@/hooks/api/use-api'
import { useAccountMe } from '@/hooks/api/use-account'

export const ShareButton = ({
  time,
  isPercent,
  displayPercent,
  comment,
  className,
}: {
  time: number
  isPercent?: boolean
  displayPercent?: number
  comment?: string
  className?: string
}) => {
  const { post } = useApi()

  const { accountQuery } = useAccountMe()

  const [isAnimationStart, setIsAnimationStart] = useState(true)

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

  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <ActionButton
      disabled={isDisabled || isAnimationStart}
      onAnimationEnd={() => setIsAnimationStart(false)}
      onClick={() => {
        const telegramLink =
          import.meta.env.VITE_TELEGRAM_APP_LINK || 'https://t.me/nymb_twa_bot/nymb'
        if (shareURL.isAvailable()) {
          shareURL(telegramLink, comment || 'Check out this cool app!')
        }
        share.mutate(time)
        setIsDisabled(true)
      }}
      className={cn(
        'text-black active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed',
        className,
      )}
    >
      Share and get +{timeDisplay}
    </ActionButton>
  )
}
