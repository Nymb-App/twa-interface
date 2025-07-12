import { useMemo } from 'react'
import { Button } from '../ui/button'
import { useCountdown } from './hooks/use-countdown'
import { cn } from '@/utils'
import { WatchesIcon } from '@/assets/icons/watches'
import { ANIMATION_DURATION_COUNTUP } from '@/context/farming-context'
import { useAccountMe } from '@/hooks/api/use-account'

export const TotalEarningsBlock = ({
  value,
  isClaimStart,
  setIsClaimStart,
}: {
  value: number
  isClaimStart: boolean
  setIsClaimStart: (claimValue: boolean) => void
}) => {
  const animatedTotalEarnings = useCountdown(
    value,
    ANIMATION_DURATION_COUNTUP,
    isClaimStart,
  )
  const currentEarnings = isClaimStart ? animatedTotalEarnings : value

  const { accountQuery, accountClaimReferralRewardMutation } = useAccountMe()

  const isDisabledActionButton = useMemo(() => {
    if (!accountQuery.data) return true
    return accountQuery.data.time * 1000 < Date.now()
  }, [accountQuery.data])

  return (
    <div className="font-pixel starboard-result-block-bg mt-2 flex items-center justify-between rounded-[14px] p-4 font-[400] backdrop-blur-[8px]">
      <div className="flex basis-1/2 flex-col items-center gap-2">
        <p className="font-inter text-[14px] leading-[140%]">For Claiming</p>
        <div className="flex items-center">
          <WatchesIcon
            className="size-[36px]"
            fill={`${currentEarnings > 0 ? '#B6FF00' : '#FFFFFF99'}`}
          />
          <div>
            <span
              className={cn(
                'text-[24px] leading-[32px] tracking-[0.3px]',
                currentEarnings > 0 &&
                  'text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]',
              )}
            >
              {currentEarnings > 9999 ? '+9999' : currentEarnings}
            </span>
            <span className="ml-1 text-[#FFFFFF66]">D</span>
          </div>
        </div>
      </div>
      <div className="inline-flex basis-1/2 justify-center">
        <Button
          disabled={!value || isClaimStart || isDisabledActionButton}
          onClick={() => {
            setIsClaimStart(true)
            accountClaimReferralRewardMutation.mutate()
          }}
          className="h-[40px] rounded-[12px] bg-gradient-to-b from-[#ADFA4B] from-20% to-[#B6FF00] text-[#121312] uppercase disabled:cursor-not-allowed disabled:from-[#414241] disabled:to-[#363736] disabled:text-white disabled:opacity-100"
        >
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_225_9928)">
              <path
                d="M12.4999 15.9997H4.50085L4.49988 13.9997H12.4999V15.9997ZM4.49988 13.9997H2.49988V11.9997H4.49988V13.9997ZM14.4999 13.9997H12.4999V11.9997H14.4999V13.9997ZM2.49988 11.9997H0.499878V3.99966H2.49988V11.9997ZM16.4999 4.00064V11.9997H14.4999V3.99966L16.4999 4.00064ZM8.49988 7.99966L13.4999 8.00064V10.0006L6.49988 9.99966V3.99966H8.49988V7.99966ZM4.49988 3.99966H2.49988L2.50085 1.99966H4.50085L4.49988 3.99966ZM14.4999 3.99966H12.4999L12.5009 1.99966H14.5009L14.4999 3.99966ZM12.5009 1.99966H4.50085L4.49988 -0.000335693H12.4999L12.5009 1.99966Z"
                fill={!value ? 'rgba(255,255,255,0.6)' : '#121312'}
              />
            </g>
            <defs>
              <clipPath id="clip0_225_9928">
                <rect
                  width="16"
                  height="16"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
          <span className="mt-0.5">claim</span>
        </Button>
      </div>
    </div>
  )
}
